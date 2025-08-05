import axios from "axios";
import FormData from "form-data";
import readline from "readline";
import { faker } from "@faker-js/faker";
import SerpApi from "google-search-results-nodejs";

// ✅ Cấu hình
const BASE_URL = "http://localhost:3000/products";
const CATEGORY_URL = "http://localhost:3000/categories";
const PRODUCT_COUNT = 10;
const SellerID = "6800bbfe1ad324e3bad2845b";
const serpapi = new SerpApi.GoogleSearch("9379835be11292be8eff695aecd4a97057b424823f4f169f7df87498157f2151");

let token = "";

// ✅ Danh sách ngành hàng
const categories = [
  {
    name: "Thời trang",
    keywords: ["áo sơ mi", "quần jean", "váy", "giày thể thao", "áo khoác"],
    description: "Thiết kế hiện đại, phù hợp xu hướng, chất liệu cao cấp.",
  },
  {
    name: "Điện tử",
    keywords: ["laptop", "tai nghe", "điện thoại", "smartwatch", "camera"],
    description: "Hiệu năng mạnh mẽ, công nghệ tiên tiến, trải nghiệm mượt mà.",
  },
  {
    name: "Mỹ phẩm",
    keywords: ["son môi", "kem dưỡng", "nước hoa", "sữa rửa mặt", "mặt nạ"],
    description: "Thành phần thiên nhiên, chăm sóc da toàn diện, an toàn dịu nhẹ.",
  },
  {
    name: "Thể thao",
    keywords: ["giày chạy", "vợt tennis", "bóng đá", "quần thể thao", "áo gym"],
    description: "Độ bền cao, hỗ trợ vận động tối ưu, phong cách năng động.",
  },
  {
    name: "Nhà cửa",
    keywords: ["ghế sofa", "đèn ngủ", "chăn ga", "bàn ăn", "rèm cửa"],
    description: "Tạo không gian sống tiện nghi, thẩm mỹ và ấm cúng.",
  },
];

// ✅ Nhập token từ terminal
const askToken = () => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question("🔐 Nhập token của bạn: ", (input) => {
      token = input.trim();
      rl.close();
      resolve();
    });
  });
};

// ✅ Kiểm tra hoặc tạo category
const getOrCreateCategory = async (name, description) => {
  try {
    const res = await axios.get(CATEGORY_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const existing = res.data?.data?.categories?.find(
      (cat) => cat.name.toLowerCase() === name.toLowerCase()
    );

    if (existing) {
      console.log(`📁 Đã có category: ${name}`);
      return existing._id;
    }

    const createRes = await axios.post(
      CATEGORY_URL,
      { name, description },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const newCategory = createRes.data?.data;
    console.log(`🆕 Tạo mới category: ${name}`);
    return newCategory._id;
  } catch (err) {
    console.error("❌ Lỗi khi kiểm tra/tạo category:", err.response?.data || err.message);
    return null;
  }
};

// ✅ Tìm ảnh thật từ Google Images (có fallback)
const getImageURL = async (keyword) => {
  return new Promise((resolve, reject) => {
    serpapi.json({ q: keyword, tbm: "isch", num: 1 }, (data) => {
      const image = data.images_results?.[0]?.original;
      if (image) resolve(image);
      else reject("Không tìm thấy ảnh");
    });
  });
};

const safeGetImageURL = async (keyword) => {
  try {
    return await getImageURL(keyword);
  } catch {
    console.warn(`⚠️ Không tìm thấy ảnh cho từ khóa: ${keyword}`);
    return "https://via.placeholder.com/480x480?text=No+Image";
  }
};

const fetchImageBuffer = async (url) => {
  const res = await axios.get(url, { responseType: "arraybuffer" });
  return Buffer.from(res.data);
};

// ✅ Tạo sản phẩm và upload ảnh
const createProduct = async () => {
  const category = faker.helpers.arrayElement(categories);
  const keyword = faker.helpers.arrayElement(category.keywords);
  const title = `${faker.commerce.productAdjective()} ${faker.commerce.productMaterial()} ${keyword}`;
  const Description = category.description;
  const Price = faker.number.int({ min: 100000, max: 1000000 });
  const Quality = faker.helpers.arrayElement(["Low", "Medium", "High"]);

  const categoryID = await getOrCreateCategory(category.name, category.description);
  if (!categoryID) {
    console.warn("⚠️ Không lấy được categoryID, bỏ qua sản phẩm này");
    return;
  }

  try {
    console.log(`🔧 Tạo sản phẩm: ${title} (${category.name})`);

    const productData = {
      title,
      Price,
      Description,
      categoryID,
      SellerID,
      Quality,
      variants: [
        { name: "Size M", price: Price },
        { name: "Size L", price: Price + 20000 },
      ],
    };

    const res = await axios.post(BASE_URL, productData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const productID =
      res.data?.product?._id ||
      res.data?.data?._id ||
      res.data?.data?.product?._id;

    if (!productID) {
      console.warn("⚠️ Không lấy được ID sản phẩm");
      return;
    }

    console.log(`✅ Tạo thành công → ID: ${productID}`);

    const mainImageURL = await safeGetImageURL(keyword);

    const galleryKeywords = [
      `${keyword} phong cách`,
      `${keyword} thời trang`,
      `${keyword} mẫu mới`,
      `${keyword} đẹp`,
      `${keyword} cao cấp`,
    ];

    const galleryURLs = await Promise.all(
      galleryKeywords.map(safeGetImageURL)
    );

    const mainImageBuffer = await fetchImageBuffer(mainImageURL);
    const galleryBuffers = await Promise.all(galleryURLs.map(fetchImageBuffer));

    const form = new FormData();
    form.append("title", title);
    form.append("description", Description);
    form.append("name", title);
    form.append("Quality", Quality);
    form.append("price", Price.toString());
    form.append("categoryID", categoryID);
    form.append("imageURL", mainImageURL);

    galleryBuffers.forEach((buffer, index) => {
      form.append("images", buffer, { filename: `gallery-${index}.jpg` });
    });

    await axios.patch(`${BASE_URL}/${productID}/upload-images`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(`🖼️ Đã upload ảnh cho sản phẩm ${productID}`);
  } catch (err) {
    console.error("❌ Lỗi tạo sản phẩm:");
    console.error("Status:", err.response?.status);
    console.error("Data:", err.response?.data || err.message);
  }
};

// ✅ Chạy vòng lặp sau khi nhập token
const seedProducts = async () => {
  await askToken();
  for (let i = 0; i < PRODUCT_COUNT; i++) {
    await createProduct();
  }
  console.log("🎉 Hoàn tất tạo sản phẩm!");
};

seedProducts();