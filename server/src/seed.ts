import bcrypt from "bcryptjs";
import { db } from "./config/database";

export async function seedDatabase() {
  console.log("Seeding database initial records...");
  await db.connect();

  try {
    // 1. Roles
    const rolesData = [
      { name: "CUSTOMER", description: "Standard ticket buyer" },
      { name: "ORGANIZATION", description: "Provider and operator administrator" },
      { name: "INSPECTOR", description: "Station and venue ticket inspector" },
      { name: "ADMIN", description: "Platform super administrator" },
    ];

    const rolesMap = new Map<string, number>();

    for (const r of rolesData) {
      let role = await db.orm.public.Role.where({ name: r.name }).first();
      if (!role) {
        role = await db.orm.public.Role.create({
          name: r.name,
          description: r.description,
        });
        console.log(`Created role: ${r.name}`);
      }
      rolesMap.set(r.name, role.id);
    }

    // 2. Default System Admin User
    const defaultPassword = await bcrypt.hash("Password@1234", 10);

    const demoUsers = [
      {
        firstName: "System",
        lastName: "Admin",
        email: "admin@tikora.com",
        phone: "+251911000001",
        role: "ADMIN",
      },
    ];

    for (const u of demoUsers) {
      let user = await db.orm.public.User.where({ email: u.email }).first();
      if (!user) {
        user = await db.orm.public.User.create({
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
          phone: u.phone,
          password: defaultPassword,
          isEmailVerified: true,
          isActive: true,
        });
        console.log(`Created demo user: ${u.email}`);

        const roleId = rolesMap.get(u.role);
        if (roleId) {
          await db.orm.public.UserRole.create({
            userId: user.id,
            roleId,
          });
        }

        // If organization, also create Provider and ProviderMember
        if (u.role === "ORGANIZATION") {
          let provider = await db.orm.public.Provider.where({ slug: "selam-bus-express" }).first();
          if (!provider) {
            provider = await db.orm.public.Provider.create({
              name: "Selam Bus Express",
              slug: "selam-bus-express",
              providerType: "BUS",
              licenseNumber: "BUS-LIC-2024-8891",
              tinNumber: "0098765432",
              contactPersonName: "Selam Operator",
              contactPersonEmail: u.email,
              contactPersonPhone: u.phone,
              email: u.email,
              phone: u.phone,
              city: "Addis Ababa",
              address: "Meskel Square, Addis Ababa",
              verificationStatus: "ACTIVE",
              isActive: true,
            });
            console.log("Created demo provider: Selam Bus Express");
          }

          const existingMember = await db.orm.public.ProviderMember.where({
            userId: user.id,
            providerId: provider.id,
          }).first();

          if (!existingMember) {
            await db.orm.public.ProviderMember.create({
              providerId: provider.id,
              userId: user.id,
              position: "Owner",
              status: "ACTIVE",
            });
          }
        }
      }
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    await db.close();
  }
}

if (process.argv[1] && process.argv[1].includes("seed.ts")) {
  seedDatabase();
}

