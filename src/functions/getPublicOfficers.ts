import { Request, Response } from "@google-cloud/functions-framework";
import { db } from "../firebase";

interface OfficerInDivision {
  firstName: string;
  lastName: string;
  photo: string | null;
  socialLinks: {
    linkedin: string | null;
    github: string | null;
    personalEmail: string | null;
  };
  title: string;
}

interface OfficerWithLevel extends OfficerInDivision {
  level: number;
}

export const getPublicOfficers = async (req: Request, res: Response): Promise<void> => {
  try {
    const snapshot = await db.collection('officer').get();

    // Map to store officers grouped by division
    const divisionMap = new Map<string, OfficerWithLevel[]>();

    snapshot.docs.forEach(doc => {
      const data = doc.data();

      // Find active roles (where endDate is null)
      const activeRoles = data.roles?.filter((role: any) => role.endDate === null) || [];

      // Add officer to each division they're active in
      activeRoles.forEach((role: any) => {
        const officerData: OfficerWithLevel = {
          firstName: data.firstName,
          lastName: data.lastName,
          photo: data.photo?.url ?? null,
          socialLinks: {
            linkedin: data.socialLinks?.linkedin ?? null,
            github: data.socialLinks?.github ?? null,
            personalEmail: data.socialLinks?.personalEmail ?? null,
          },
          level: role.level,
          title: role.title,
        };

        if (!divisionMap.has(role.division)) {
          divisionMap.set(role.division, []);
        }
        divisionMap.get(role.division)!.push(officerData);
      });
    });

    // Sort officers within each division and convert to object
    const divisions: Record<string, OfficerInDivision[]> = {};

    divisionMap.forEach((officers, division) => {
      // Sort by level (descending), then alphabetically by first name, then last name
      officers.sort((a, b) => {
        if (b.level !== a.level) {
          return b.level - a.level; // Higher level first
        }
        if (a.firstName !== b.firstName) {
          return a.firstName.localeCompare(b.firstName);
        }
        return a.lastName.localeCompare(b.lastName);
      });

      // Remove level field before sending to frontend
      divisions[division] = officers.map(({ level, ...officer }) => officer);
    });

    // Set caching headers (24 hours)
    res.set('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    res.status(200).json(divisions);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Server error'
    });
  }
};