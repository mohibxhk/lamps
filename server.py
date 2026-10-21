from fastapi import FastAPI, APIRouter, Request, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import time
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict, BeforeValidator
from typing import List, Optional, Annotated
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Gianni Gabutti API")
api_router = APIRouter(prefix="/api")

PyObjectId = Annotated[str, BeforeValidator(str)]


class BaseDocument(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="ignore")
    id: Optional[PyObjectId] = Field(default=None, alias="_id")

    def to_mongo(self) -> dict:
        return self.model_dump(by_alias=True, exclude={"id"}, exclude_none=True)

    @classmethod
    def from_mongo(cls, doc):
        if not doc:
            return None
        doc = dict(doc)
        if "_id" in doc:
            doc["_id"] = str(doc["_id"])
        return cls(**doc)


class LocalizedText(BaseModel):
    it: str = ""
    en: str = ""


class Spec(BaseModel):
    key: str
    value: str


class Product(BaseDocument):
    slug: str
    name: str
    collection: Optional[str] = None
    categories: List[str] = Field(default_factory=list)
    tagline: LocalizedText = Field(default_factory=LocalizedText)
    description: LocalizedText = Field(default_factory=LocalizedText)
    materials: List[LocalizedText] = Field(default_factory=list)
    finishes: List[str] = Field(default_factory=list)
    specs: List[Spec] = Field(default_factory=list)
    demo: bool = True
    featured: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Project(BaseDocument):
    slug: str
    title: str
    category: str = "residential"
    location: Optional[str] = None
    year: Optional[str] = None
    designer: Optional[str] = None
    summary: LocalizedText = Field(default_factory=LocalizedText)
    description: LocalizedText = Field(default_factory=LocalizedText)
    concept: LocalizedText = Field(default_factory=LocalizedText)
    products_used: List[str] = Field(default_factory=list)
    demo: bool = True
    featured: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Enquiry(BaseDocument):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None
    type: str = "general"
    reference: Optional[str] = None
    message: str
    lang: str = "it"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class EnquiryCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=40)
    company: Optional[str] = Field(default=None, max_length=120)
    type: str = Field(default="general", pattern="^(general|product|project|service)$")
    reference: Optional[str] = Field(default=None, max_length=120)
    message: str = Field(min_length=10, max_length=4000)
    privacy: bool
    lang: str = Field(default="it", pattern="^(it|en)$")
    website: Optional[str] = None  # honeypot, must stay empty


class ChatMessage(BaseModel):
    role: str = "user"
    content: str = Field(max_length=2000)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=1000)
    lang: str = Field(default="it", pattern="^(it|en)$")
    history: List[ChatMessage] = Field(default_factory=list)


_rate_store: dict = {}


def rate_limit(ip: str, limit: int, window: int):
    now = time.time()
    hits = [t for t in _rate_store.get(ip, []) if now - t < window]
    if len(hits) >= limit:
        raise HTTPException(status_code=429, detail="Too many requests")
    hits.append(now)
    _rate_store[ip] = hits


@api_router.get("/")
async def root():
    return {"message": "Gianni Gabutti API"}


@api_router.get("/products", response_model=List[Product])
async def list_products(category: Optional[str] = None, q: Optional[str] = None):
    query = {}
    if category and category != "all":
        query["categories"] = category
    if q:
        query["name"] = {"$regex": q.strip()[:60], "$options": "i"}
    docs = await db.products.find(query).sort("created_at", 1).to_list(200)
    return [Product.from_mongo(d) for d in docs]


@api_router.get("/products/{slug}", response_model=Product)
async def get_product(slug: str):
    doc = await db.products.find_one({"slug": slug})
    if not doc:
        raise HTTPException(status_code=404, detail="Product not found")
    return Product.from_mongo(doc)


@api_router.get("/projects", response_model=List[Project])
async def list_projects(category: Optional[str] = None):
    query = {}
    if category and category != "all":
        query["category"] = category
    docs = await db.projects.find(query).sort("created_at", 1).to_list(200)
    return [Project.from_mongo(d) for d in docs]


@api_router.get("/projects/{slug}", response_model=Project)
async def get_project(slug: str):
    doc = await db.projects.find_one({"slug": slug})
    if not doc:
        raise HTTPException(status_code=404, detail="Project not found")
    return Project.from_mongo(doc)


@api_router.post("/enquiries", status_code=201)
async def create_enquiry(payload: EnquiryCreate, request: Request):
    if payload.website:
        raise HTTPException(status_code=400, detail="Invalid submission")
    if not payload.privacy:
        raise HTTPException(status_code=422, detail="Privacy consent required")
    rate_limit(request.client.host if request.client else "unknown", 6, 60)
    enquiry = Enquiry(**payload.model_dump(exclude={"website", "privacy"}))
    await db.enquiries.insert_one(enquiry.to_mongo())
    return {"ok": True}


CHAT_STUB = {
    "it": ("Il servizio di assistenza automatica è in fase di configurazione. "
           "Nel frattempo puoi sfogliare il catalogo, esplorare i progetti o inviare una richiesta dalla pagina Contatti."),
    "en": ("The assistant service is currently being configured. "
           "In the meantime you can browse the catalogue, explore projects or send an enquiry from the Contact page."),
}


@api_router.post("/chat")
async def chat(payload: ChatRequest, request: Request):
    rate_limit(request.client.host if request.client else "unknown", 20, 60)
    # Integration skeleton: plug an LLM provider here (see README, section 11).
    # Credentials must live in backend/.env and never reach the frontend.
    return {
        "configured": False,
        "reply": CHAT_STUB.get(payload.lang, CHAT_STUB["en"]),
    }


DEMO_PRODUCTS = [
    {
        "slug": "bruma", "name": "Bruma", "collection": "Bruma",
        "categories": ["pendant", "indoor"], "featured": True, "demo": True,
        "tagline": {"it": "Sospensione a luce diffusa", "en": "Diffused-light pendant"},
        "description": {
            "it": "Scheda dimostrativa. Un volume sospeso che filtra la luce attraverso un diffusore opalino, pensato per tavoli e zone conversazione.",
            "en": "Demo entry. A suspended volume filtering light through an opal diffuser, designed for tables and conversation areas."},
        "materials": [{"it": "Metallo verniciato", "en": "Powder-coated metal"}, {"it": "Vetro opalino", "en": "Opal glass"}],
        "finishes": ["Nero opaco", "Ottone spazzolato", "Grigio cemento"],
        "specs": [{"key": "source", "value": "LED"}, {"key": "dimming", "value": "DALI / TRIAC"}],
    },
    {
        "slug": "solivo", "name": "Solivo", "collection": "Solivo",
        "categories": ["floor", "indoor"], "featured": True, "demo": True,
        "tagline": {"it": "Lampada da terra orientabile", "en": "Adjustable floor lamp"},
        "description": {
            "it": "Scheda dimostrativa. Un profilo verticale essenziale con testa orientabile per una luce da lettura precisa e silenziosa.",
            "en": "Demo entry. An essential vertical profile with an adjustable head for precise, quiet reading light."},
        "materials": [{"it": "Alluminio estruso", "en": "Extruded aluminium"}],
        "finishes": ["Nero opaco", "Bronzo anodizzato"],
        "specs": [{"key": "source", "value": "LED"}, {"key": "dimming", "value": "Integrato"}],
    },
    {
        "slug": "tensa", "name": "Tensa", "collection": "Tensa",
        "categories": ["wall", "indoor"], "featured": True, "demo": True,
        "tagline": {"it": "Applique a emissione indiretta", "en": "Indirect-emission wall lamp"},
        "description": {
            "it": "Scheda dimostrativa. Una lamina sottile che stacca la luce dalla parete, disegnando un alone morbido e architettonico.",
            "en": "Demo entry. A thin blade lifting light off the wall, drawing a soft, architectural halo."},
        "materials": [{"it": "Acciaio", "en": "Steel"}],
        "finishes": ["Bianco opaco", "Nero opaco"],
        "specs": [{"key": "source", "value": "LED"}, {"key": "ip", "value": "IP20"}],
    },
    {
        "slug": "faldo", "name": "Faldo", "collection": "Faldo",
        "categories": ["table", "indoor"], "featured": False, "demo": True,
        "tagline": {"it": "Lampada da tavolo compatta", "en": "Compact table lamp"},
        "description": {
            "it": "Scheda dimostrativa. Un piccolo volume domestico per piani di lavoro e comodini, con luce calda e controllata.",
            "en": "Demo entry. A small domestic volume for desks and bedside tables, with warm, controlled light."},
        "materials": [{"it": "Metallo verniciato", "en": "Powder-coated metal"}],
        "finishes": ["Grigio cemento"],
        "specs": [{"key": "source", "value": "LED"}],
    },
    {
        "slug": "rivo", "name": "Rivo", "collection": "Rivo",
        "categories": ["ceiling", "indoor"], "featured": False, "demo": True,
        "tagline": {"it": "Plafoniera a incasso visivo", "en": "Visual-comfort ceiling lamp"},
        "description": {
            "it": "Scheda dimostrativa. Una superficie luminosa continua per ambienti contract e residenziali.",
            "en": "Demo entry. A continuous luminous surface for contract and residential interiors."},
        "materials": [{"it": "Alluminio", "en": "Aluminium"}, {"it": "Diffusore microprismatico", "en": "Microprismatic diffuser"}],
        "finishes": ["Bianco opaco"],
        "specs": [{"key": "source", "value": "LED"}, {"key": "ugr", "value": "< 19"}],
    },
    {
        "slug": "lama", "name": "Lama 02", "collection": "Lama",
        "categories": ["architectural", "outdoor"], "featured": True, "demo": True,
        "tagline": {"it": "Segnapasso architetturale", "en": "Architectural marker light"},
        "description": {
            "it": "Scheda dimostrativa. Un segno luminoso radente per percorsi esterni e facciate.",
            "en": "Demo entry. A grazing line of light for outdoor paths and facades."},
        "materials": [{"it": "Alluminio anodizzato", "en": "Anodised aluminium"}],
        "finishes": ["Bronzo anodizzato", "Grigio cemento"],
        "specs": [{"key": "source", "value": "LED"}, {"key": "ip", "value": "IP65"}],
    },
]

DEMO_PROJECTS = [
    {
        "slug": "residenza-demo", "title": "Residenza privata", "category": "residential",
        "location": "Italia", "year": "20--", "featured": True, "demo": True,
        "summary": {"it": "Progetto dimostrativo.", "en": "Demo project."},
        "description": {
            "it": "Scheda dimostrativa per mostrare la struttura della pagina progetto. I contenuti reali saranno inseriti dall'azienda.",
            "en": "Demo entry showing the project page structure. Real content will be supplied by the company."},
        "concept": {
            "it": "Il concept illuminotecnico verrà descritto qui.",
            "en": "The lighting concept will be described here."},
        "products_used": ["bruma", "solivo"],
    },
    {
        "slug": "ospitalita-demo", "title": "Spazio hospitality", "category": "hospitality",
        "location": "Italia", "year": "20--", "featured": True, "demo": True,
        "summary": {"it": "Progetto dimostrativo.", "en": "Demo project."},
        "description": {
            "it": "Scheda dimostrativa per mostrare la struttura della pagina progetto. I contenuti reali saranno inseriti dall'azienda.",
            "en": "Demo entry showing the project page structure. Real content will be supplied by the company."},
        "concept": {
            "it": "Il concept illuminotecnico verrà descritto qui.",
            "en": "The lighting concept will be described here."},
        "products_used": ["tensa", "rivo"],
    },
    {
        "slug": "retail-demo", "title": "Spazio retail", "category": "retail",
        "location": "Italia", "year": "20--", "featured": False, "demo": True,
        "summary": {"it": "Progetto dimostrativo.", "en": "Demo project."},
        "description": {
            "it": "Scheda dimostrativa per mostrare la struttura della pagina progetto. I contenuti reali saranno inseriti dall'azienda.",
            "en": "Demo entry showing the project page structure. Real content will be supplied by the company."},
        "concept": {
            "it": "Il concept illuminotecnico verrà descritto qui.",
            "en": "The lighting concept will be described here."},
        "products_used": ["faldo"],
    },
    {
        "slug": "outdoor-demo", "title": "Percorso esterno", "category": "outdoor",
        "location": "Italia", "year": "20--", "featured": False, "demo": True,
        "summary": {"it": "Progetto dimostrativo.", "en": "Demo project."},
        "description": {
            "it": "Scheda dimostrativa per mostrare la struttura della pagina progetto. I contenuti reali saranno inseriti dall'azienda.",
            "en": "Demo entry showing the project page structure. Real content will be supplied by the company."},
        "concept": {
            "it": "Il concept illuminotecnico verrà descritto qui.",
            "en": "The lighting concept will be described here."},
        "products_used": ["lama"],
    },
]


@app.on_event("startup")
async def seed_demo_content():
    if await db.products.count_documents({}) == 0:
        await db.products.insert_many([Product(**p).to_mongo() for p in DEMO_PRODUCTS])
    if await db.projects.count_documents({}) == 0:
        await db.projects.insert_many([Project(**p).to_mongo() for p in DEMO_PROJECTS])


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
