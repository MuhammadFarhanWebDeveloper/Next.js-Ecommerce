import { verifyToken } from "@/lib/server-actions/auth";
import prisma from "@/util/db.config";
export const getUser = async (authtoken) => {
  try {
    const { id } = await verifyToken(authtoken);

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        bio: true,
        isSeller: true,
        profilePicture: true,
        phoneNumber: true,
        address: true,
        seller: {
          select: {
            id: true,
            storeName: true,
            storeDescription: true,
            storeLogo: true,
            businessAddress: true,
          },
        },
      },
    });

    if (!user) return null;
    return user;
  } catch (error) {
    return null;
  }
};

export const getProducts = async (
  page = 1,
  category = "",
  search = "",
  sellerId = 0
) => {
  try {
    const ITEMS_PER_PAGE = 8; // Default items per page
    const offset = (page - 1) * ITEMS_PER_PAGE; // Calculate offset for pagination

    // Build filters
    const filters = {};

    // Add category filter if provided
    if (category) {
      filters.category = { name: category };
    }

    // Add search filter if provided
    if (search) {
      const searchTerms = search.split(" ");
      filters.OR = searchTerms.map((term) => ({
        OR: [
          { name: { contains: term, mode: "insensitive" } },
          { description: { contains: term, mode: "insensitive" } },
        ],
      }));
    }

    // Add seller filter if provided
    if (sellerId) {
      filters.sellerId = sellerId;
    }

    // Fetch filtered and paginated products
    const db_query = await prisma.product.findMany({
      where: filters,
      include: {
        seller: true,
        category: true,
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: offset,
      take: ITEMS_PER_PAGE,
    });
    const products = db_query.map((product) => {
      const { createdAt, updatedAt, ...rest } = product;
      return {
        ...rest,
      };
    });
    // Count total matching products for pagination
    const totalCount = await prisma.product.count({
      where: filters,
    });

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    return {
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: ITEMS_PER_PAGE,
      },
    };
  } catch (error) {
    console.log(error.message);
    return null;
  }
};
