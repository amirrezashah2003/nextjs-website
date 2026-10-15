const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('در حال خواندن فایل db.json...');

  // مسیر فایل db.json (باید بررسی کنید که فایل json-server کجای پروژه شماست)
  // فرض بر این است که فایل db.json در ریشه پروژه قرار دارد
  const dbPath = path.join(__dirname, '../db.json'); 

  if (!fs.existsSync(dbPath)) {
    console.error('فایل db.json در ریشه پروژه پیدا نشد!');
    return;
  }

  const fileData = fs.readFileSync(dbPath, 'utf8');
  const jsonData = JSON.parse(fileData);

  // فرض بر این است که در فایل db.json لیستی به نام products دارید
  // اگر نام کلید چیز دیگری است (مثلا posts)، آن را تغییر دهید
  const products = jsonData.products || [];

  if (products.length === 0) {
    console.log('هیچ محصولی در فایل db.json یافت نشد.');
    return;
  }

  console.log(`تعداد ${products.length} محصول پیدا شد. در حال انتقال به SQLite...`);

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: product,
      create: product,
    });
  }

  console.log('تمام داده‌های db.json با موفقیت به SQLite منتقل شدند! 🎉');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });