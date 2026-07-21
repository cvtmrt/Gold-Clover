// Drizzle ORM şeması — Railway PostgreSQL tabloları.
import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  integer,
  customType,
} from "drizzle-orm/pg-core";

// Postgres bytea — ürün görselleri DB'de saklanır (Railway diski kalıcı değil).
const bytea = customType({
  dataType() {
    return "bytea";
  },
});

// İletişim/teklif formundan gelen talepler. Panelden (/panel) yönetilir.
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone"),
  eventType: text("event_type"), // Organizasyon türü / kuaförde hizmet
  eventDate: text("event_date"), // "YYYY-MM-DD"
  message: text("message"),
  brand: text("brand").notNull().default("organizasyon"), // organizasyon | kuafor
  status: text("status").notNull().default("new"), // new | contacted | done
  createdAt: timestamp("created_at").defaultNow(),
});

// Organizasyon ürün kataloğu (balon konsepti, butik çiçek, hediyelik...).
// Panelden yönetilir; görsel WebP olarak bytea'da tutulur.
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category"),
  price: text("price"), // serbest metin ("₺350", "Talep üzerine"...)
  description: text("description"),
  imageType: text("image_type"), // "image/webp"
  imageData: bytea("image_data"),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});
