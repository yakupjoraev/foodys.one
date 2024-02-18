import { PrismaClient } from "@prisma/client";
import { subMonths } from "date-fns";

const TIMEOUNT_MONTH = 6;

async function main() {
  const textSearch = new PrismaClient().textSearch;

  const sixMonthAgo = subMonths(new Date(), TIMEOUNT_MONTH);

  const response = await textSearch.deleteMany({
    where: {
      created_at: { lte: sixMonthAgo },
    },
  });

  console.log("outdated TextSearch removed: " + response.count);
}

main().catch(console.error);
