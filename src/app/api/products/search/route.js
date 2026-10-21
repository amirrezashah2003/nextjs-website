import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const query = (searchParams.get("q") || "").trim();
    const rawLimit = searchParams.get("limit") || "6";

    const parsedLimit = Number.parseInt(rawLimit, 10);
    const limit = Math.min(
      Math.max(Number.isNaN(parsedLimit) ? 6 : parsedLimit, 1),
      20
    );

    if (!query || query.length < 2) {
      return NextResponse.json(
        { products: [] },
        { status: 200 }
      );
    }

    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
            },
          },
          {
            brand: {
              contains: query,
            },
          },
          {
            model: {
              contains: query,
            },
          },
          {
            category: {
              contains: query,
            },
          },
          {
            info: {
              contains: query,
            },
          },
        ],
      },
      take: limit,
      select: {
        id: true,
        name: true,
        price: true,
        img: true,
        info: true,
      },
    });

    const formattedProducts = products.map((product) => ({
      ...product,
      price: product.price.toString(),
    }));

    return NextResponse.json(
      {
        products: formattedProducts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/products/search:", error);

    return NextResponse.json(
      {
        error: "خطایی در سرور رخ داد",
      },
      { status: 500 }
    );
  }
}
