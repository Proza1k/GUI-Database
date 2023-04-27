export const DATABASE_CONSTANTS: Record<string, string> = {
  NAME: 'learn_isuct',
  GET_TABLE: "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"
}
