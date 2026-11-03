export interface OrganizationItem {
  id: string;
  name: string;
  category: "BUS" | "CINEMA" | "EVENT" | "SPORTS";
  verified: boolean;
}

