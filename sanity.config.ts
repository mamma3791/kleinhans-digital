import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  name: "kleinhans-digital",
  title: "Kleinhans Digital Blog",
  projectId: "z24f1kn9",
  dataset: "production",
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
