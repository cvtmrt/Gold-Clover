// Drizzle ORM şeması — Railway PostgreSQL tabloları.
import {
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// İletişim/teklif formundan gelen talepler. Panelden (/panel) yönetilir.
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone"),
  eventType: text("event_type"), // Organizasyon türü
  eventDate: text("event_date"), // "YYYY-MM-DD"
  message: text("message"),
  status: text("status").notNull().default("new"), // new | contacted | done
  createdAt: timestamp("created_at").defaultNow(),
});
