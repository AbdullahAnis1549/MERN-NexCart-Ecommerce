import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import Category from "./Models/CategorySchema.js";
import Product from "./Models/ProductSchema.js";
import User from "./Models/UserSchema.js";
import Order from "./Models/OrderSchema.js";
import Cart from "./Models/CartSchema.js";
import Wishlist from "./Models/WishlistSchema.js";
import Banner from "./Models/BannerSchema.js";
import Review from "./Models/ReviewSchema.js";
import Coupon from "./Models/CouponSchema.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.Cloudinaryname,
  api_key: process.env.Cloudinarykey,
  api_secret: process.env.Cloudinarysecret,
});

const DB = process.env.DATABASE || "mongodb://127.0.0.1:27017/ecommerce";

// Helper to upload image to Cloudinary
async function uploadImageToCloudinary(imageUrl, folder = "luxe_store") {
  try {
    const res = await cloudinary.uploader.upload(imageUrl, { folder });
    return res.secure_url;
  } catch (err) {
    console.warn(`  ⚠️ Cloudinary upload failed for ${imageUrl}, fallback to raw URL`);
    return imageUrl;
  }
}

const seedCategories = [
  {
    name: "Smartphones & Accessories",
    imageurl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Laptops & Computers",
    imageurl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Headphones & Audio",
    imageurl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Smartwatches & Wearables",
    imageurl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Gaming Consoles & Gear",
    imageurl: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Cameras & Photography",
    imageurl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Home Appliances & Tech",
    imageurl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Luxury Watches & Lifestyle",
    imageurl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80",
  },
];

const seedProductsData = {
  "Smartphones & Accessories": [
    {
      name: "iPhone 15 Pro Max",
      pdescription: "Apple flagship with A17 Pro chip, titanium body, 5x optical zoom camera, and Action button.",
      price: 349999,
      mainStock: 15,
      productimage: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Samsung Galaxy S24 Ultra",
      pdescription: "200MP Quad Tele System, Titanium frame with S Pen integration and Galaxy AI capabilities.",
      price: 319999,
      mainStock: 12,
      productimage: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Google Pixel 8 Pro",
      pdescription: "Powered by Tensor G3, pro-level camera setup with Best Take and Audio Magic Eraser.",
      price: 189999,
      mainStock: 20,
      productimage: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "OnePlus 12 5G",
      pdescription: "Snapdragon 8 Gen 3, 4th Gen Hasselblad Camera System, and 100W SUPERVOOC charging.",
      price: 159999,
      mainStock: 18,
      productimage: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Xiaomi 14 Ultra",
      pdescription: "Leica Quad Camera optics, Snapdragon 8 Gen 3 with 5000mAh battery and 90W fast charging.",
      price: 249999,
      mainStock: 10,
      productimage: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Nothing Phone (2)",
      pdescription: "Unique Glyph Interface, transparent back design, Snapdragon 8+ Gen 1, and 50MP dual cameras.",
      price: 129999,
      mainStock: 25,
      productimage: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Asus ROG Phone 8 Pro",
      pdescription: "Ultimate gaming phone with 165Hz AMOLED display, AirTrigger buttons, and AniMe Vision LED.",
      price: 229999,
      mainStock: 8,
      productimage: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Samsung Galaxy Z Flip 5",
      pdescription: "Iconic Flex Window, compact pocket-sized foldable smartphone with hands-free FlexCam.",
      price: 199999,
      mainStock: 14,
      productimage: "https://images.unsplash.com/photo-1584006682522-dc17d6c0d963?auto=format&fit=crop&w=600&q=80",
    },
  ],

  "Laptops & Computers": [
    {
      name: "MacBook Pro 16\" M3 Max",
      pdescription: "Liquid Retina XDR display, 36GB Unified Memory, M3 Max chip designed for heavy professional workflows.",
      price: 649999,
      mainStock: 8,
      productimage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Dell XPS 15 OLED",
      pdescription: "13th Gen Intel Core i9, 3.5K OLED Touch display, NVIDIA GeForce RTX 4060 graphics.",
      price: 429999,
      mainStock: 6,
      productimage: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "ASUS ROG Zephyrus G14",
      pdescription: "AMD Ryzen 9, ROG Nebula OLED display, RTX 4070 ultralight gaming laptop.",
      price: 389999,
      mainStock: 10,
      productimage: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Lenovo ThinkPad X1 Carbon Gen 11",
      pdescription: "Ultra-lightweight carbon fiber chassis, Intel Evo platform, legendary ThinkPad keyboard.",
      price: 359999,
      mainStock: 12,
      productimage: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "HP Spectre x360 2-in-1",
      pdescription: "Versatile 360-degree hinge, 4K OLED touchscreen, Intel Core i7 with AI audio noise reduction.",
      price: 319999,
      mainStock: 9,
      productimage: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Razer Blade 15 Gaming Laptop",
      pdescription: "CNC Aluminum unibody, QHD 240Hz display, RTX 4080 graphics with Chroma RGB keyboard.",
      price: 499999,
      mainStock: 5,
      productimage: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "MacBook Air 15\" M2",
      pdescription: "Incredibly thin 15-inch design, M2 chip with 18 hours battery life and silent fanless cooling.",
      price: 269999,
      mainStock: 16,
      productimage: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Microsoft Surface Laptop 5",
      pdescription: "Sleek PixelSense touchscreen, Alcantara palm rest, 12th Gen Intel Core i7 with Thunderbolt 4.",
      price: 249999,
      mainStock: 11,
      productimage: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80",
    },
  ],

  "Headphones & Audio": [
    {
      name: "Sony WH-1000XM5 Wireless Headphones",
      pdescription: "Industry-leading active noise cancellation with 8 microphones and Auto NC Optimizer.",
      price: 94999,
      mainStock: 25,
      productimage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Apple AirPods Max",
      pdescription: "Apple-designed dynamic driver, active noise cancellation, and Spatial Audio with dynamic head tracking.",
      price: 149999,
      mainStock: 15,
      productimage: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Bose QuietComfort Ultra",
      pdescription: "World-class noise cancelling, Immersive Audio listening, and customizable CustomTune sound.",
      price: 119999,
      mainStock: 18,
      productimage: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Sennheiser Momentum 4 Wireless",
      pdescription: "Audiophile-inspired 42mm transducer system, 60-hour battery life, and adaptive noise cancellation.",
      price: 89999,
      mainStock: 20,
      productimage: "https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Beats Studio Pro",
      pdescription: "Custom acoustic platform, Lossless Audio via USB-C, and Personalized Spatial Audio.",
      price: 79999,
      mainStock: 22,
      productimage: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Sony WF-1000XM5 Earbuds",
      pdescription: "The best noise-cancelling earbuds with Dual Processors V2 and HD Noise Cancelling Processor QN2e.",
      price: 69999,
      mainStock: 30,
      productimage: "https://images.unsplash.com/photo-1590658006821-04f4008d5717?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "JBL Tour One M2",
      pdescription: "True Adaptive Noise Cancelling, Personi-Fi 2.0 sound customization, and 50-hour playback.",
      price: 59999,
      mainStock: 14,
      productimage: "https://images.unsplash.com/photo-1577174881658-0f30ed549adc?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Audio-Technica ATH-M50xBT2",
      pdescription: "Legendary studio sound signature, 50-hour battery life, and dual beamforming microphones.",
      price: 49999,
      mainStock: 17,
      productimage: "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=600&q=80",
    },
  ],

  "Smartwatches & Wearables": [
    {
      name: "Apple Watch Ultra 2",
      pdescription: "49mm titanium case, brightest display ever (3000 nits), dual-frequency GPS, and S9 SiP chip.",
      price: 249999,
      mainStock: 10,
      productimage: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Samsung Galaxy Watch 6 Classic",
      pdescription: "Physical rotating bezel, Sapphire Crystal glass, Body Composition analysis, and Sleep Coaching.",
      price: 89999,
      mainStock: 20,
      productimage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Garmin Fenix 7X Pro Sapphire Solar",
      pdescription: "Solar charging lens, built-in LED flashlight, multi-band GPS tracking, and endurance score.",
      price: 219999,
      mainStock: 8,
      productimage: "https://images.unsplash.com/photo-1517502474097-f9b30659dadb?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Fitbit Sense 2",
      pdescription: "Advanced health smartwatch with cEDA continuous stress tracking and ECG heart rhythm monitoring.",
      price: 54999,
      mainStock: 15,
      productimage: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Amazfit GTR 4",
      pdescription: "Dual-band circularly-polarized GPS antenna, 150+ sports modes, and 14-day ultra-long battery life.",
      price: 39999,
      mainStock: 25,
      productimage: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Google Pixel Watch 2",
      pdescription: "All-new multi-path heart rate sensor, safety check feature, and integrated Fitbit health insights.",
      price: 99999,
      mainStock: 12,
      productimage: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Apple Watch Series 9",
      pdescription: "Double tap gesture, S9 SiP processor, carbon neutral case combinations, and crash detection.",
      price: 139999,
      mainStock: 18,
      productimage: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Huawei Watch GT 4 46mm",
      pdescription: "Geometric octagonal aesthetic, 14-day battery life, and Stay Fit caloric management system.",
      price: 49999,
      mainStock: 19,
      productimage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    },
  ],

  "Gaming Consoles & Gear": [
    {
      name: "PlayStation 5 Slim Edition",
      pdescription: "1TB high-speed SSD storage, Ray Tracing support, 4K 120Hz gaming with DualSense wireless controller.",
      price: 179999,
      mainStock: 14,
      productimage: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Xbox Series X 1TB",
      pdescription: "12 Teraflops processing power, Xbox Velocity Architecture, Quick Resume feature for games.",
      price: 169999,
      mainStock: 12,
      productimage: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Nintendo Switch OLED Model",
      pdescription: "7-inch OLED screen, wide adjustable stand, wired LAN port dock, and 64GB internal storage.",
      price: 104999,
      mainStock: 20,
      productimage: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Steam Deck OLED 512GB",
      pdescription: "7.4-inch HDR OLED display, custom AMD APU, Wi-Fi 6E, and handheld PC gaming experience.",
      price: 199999,
      mainStock: 9,
      productimage: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "ASUS ROG Ally Z1 Extreme",
      pdescription: "Windows 11 gaming handheld, 120Hz FHD display, AMD Ryzen Z1 Extreme processor.",
      price: 189999,
      mainStock: 11,
      productimage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "PlayStation VR2 Horizon Bundle",
      pdescription: "4K HDR OLED displays, 110-degree field of view, Tempest 3D AudioTech, and Sense controllers.",
      price: 184999,
      mainStock: 7,
      productimage: "https://images.unsplash.com/photo-1622979135225-d2ba269bc1bd?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Xbox Elite Wireless Controller Series 2",
      pdescription: "Adjustable-tension thumbsticks, wrap-around rubberized grip, and hair trigger locks.",
      price: 49999,
      mainStock: 25,
      productimage: "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Logitech G PRO X 2 LIGHTSPEED Headset",
      pdescription: "50mm Graphene drivers, LIGHTSPEED wireless technology, Blue VO!CE broadcast mic filter.",
      price: 69999,
      mainStock: 16,
      productimage: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80",
    },
  ],

  "Cameras & Photography": [
    {
      name: "Sony Alpha A7 IV Mirrorless Camera",
      pdescription: "33MP Full-Frame Exmor R CMOS sensor, 4K 60p video recording, and real-time Eye AF.",
      price: 689999,
      mainStock: 5,
      productimage: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Canon EOS R6 Mark II",
      pdescription: "24.2MP full-frame CMOS sensor, 40 fps continuous shooting, and 4K 60p uncropped movie capture.",
      price: 649999,
      mainStock: 6,
      productimage: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Fujifilm X-T5 Digital Camera",
      pdescription: "40.2MP APS-C X-Trans CMOS 5 HR sensor, 5-axis IBIS, classical dial-based film simulation modes.",
      price: 459999,
      mainStock: 8,
      productimage: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Nikon Z6 II Mirrorless Body",
      pdescription: "Dual EXPEED 6 processors, 24.5MP BSI sensor, 273-point Hybrid AF system with Dual Card Slots.",
      price: 419999,
      mainStock: 7,
      productimage: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "DJI Mini 4 Pro Fly More Combo",
      pdescription: "Under 249g lightweight drone, 4K 60fps HDR True Vertical Shooting, omnidirectional obstacle sensing.",
      price: 349999,
      mainStock: 10,
      productimage: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "GoPro HERO12 Black Creator Edition",
      pdescription: "5.3K60 video, HyperSmooth 6.0 stabilization, HDR video, Volta battery grip, and light mod.",
      price: 149999,
      mainStock: 18,
      productimage: "https://images.unsplash.com/photo-1564466809058-bf4114d55352?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Sigma 24-70mm f/2.8 DG DN Art Lens",
      pdescription: "Flagship large-aperture standard zoom lens designed for mirrorless full-frame cameras.",
      price: 289999,
      mainStock: 9,
      productimage: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "DJI Osmo Pocket 3 Creator Combo",
      pdescription: "1-inch CMOS pocket gimbal camera, 4K 120fps, 2-inch rotatable OLED touchscreen.",
      price: 179999,
      mainStock: 12,
      productimage: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80",
    },
  ],

  "Home Appliances & Tech": [
    {
      name: "Dyson V15 Detect Cordless Vacuum",
      pdescription: "Laser reveals microscopic dust, piezo sensor measures dust particles, high-torque cleaner head.",
      price: 199999,
      mainStock: 9,
      productimage: "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Philips Hue Starter Kit RGB",
      pdescription: "Smart ambient LED lighting kit with Hue Bridge, 4 E27 color bulbs, and smart dimmer switch.",
      price: 49999,
      mainStock: 25,
      productimage: "https://images.unsplash.com/photo-1550985616-10810253b84d?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Amazon Echo Show 10 (3rd Gen)",
      pdescription: "10.1-inch HD smart display with motion that automatically turns to follow you in video calls.",
      price: 69999,
      mainStock: 14,
      productimage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Nest Learning Thermostat (4th Gen)",
      pdescription: "Auto-schedules based on your daily routine, energy history insights, remote control via phone.",
      price: 64999,
      mainStock: 16,
      productimage: "https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Roborock S8 MaxV Ultra Robot Vacuum",
      pdescription: "10,000Pa extreme suction, reactive AI 2.0 obstacle recognition, self-washing & drying dock.",
      price: 389999,
      mainStock: 7,
      productimage: "https://images.unsplash.com/photo-1616763355548-1b606f439f86?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Breville Barista Touch Espresso Machine",
      pdescription: "Automated touch screen operation, integrated precision grinder, ThermoJet 3 second heat up.",
      price: 319999,
      mainStock: 6,
      productimage: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Nespresso Vertuo Next Deluxe",
      pdescription: "Centrifusion technology espresso maker with automatic capsule barcode recognition.",
      price: 44999,
      mainStock: 22,
      productimage: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Xiaomi Smart Air Purifier 4 Pro",
      pdescription: "99.97% filtration of 0.3μm particles, OLED touch display, negative air ionization feature.",
      price: 54999,
      mainStock: 18,
      productimage: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=80",
    },
  ],

  "Luxury Watches & Lifestyle": [
    {
      name: "Rolex Submariner Date 126610LN",
      pdescription: "Oystersteel luxury diving timepiece, 41mm case, Cerachrom bezel insert in black ceramic.",
      price: 3499999,
      mainStock: 2,
      productimage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Omega Speedmaster Professional Moonwatch",
      pdescription: "Co-Axial Master Chronometer Calibre 3861, legendary manual-winding chronograph watch.",
      price: 1899999,
      mainStock: 3,
      productimage: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "TAG Heuer Carrera Chronograph",
      pdescription: "Automatic chronograph watch, blue sunray dial, stainless steel bracelet with H-shape links.",
      price: 1299999,
      mainStock: 4,
      productimage: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Tissot PRX Powermatic 80",
      pdescription: "Integrated bracelet design, waffle pattern dial, Powermatic 80 movement with 80 hours power reserve.",
      price: 219999,
      mainStock: 15,
      productimage: "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Seiko Prospex Speedtimer Chronograph",
      pdescription: "Solar-powered quartz chronograph, curved sapphire crystal, lumibrite hands and indexes.",
      price: 179999,
      mainStock: 16,
      productimage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Ray-Ban Aviator Classic Gold Frame",
      pdescription: "G-15 green polarized lenses, 18k gold-plated frame, legendary 1936 original aviator style.",
      price: 42999,
      mainStock: 30,
      productimage: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Montblanc Meisterstück Classique Ballpoint Pen",
      pdescription: "Deep black precious resin with gold-coated clip and details, iconic white star emblem.",
      price: 119999,
      mainStock: 10,
      productimage: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Fossil Heritage Leather Wallet & Keychain Gift Set",
      pdescription: "100% genuine eco-leather bifold wallet with RFID blocking technology and matching leather keychain.",
      price: 24999,
      mainStock: 25,
      productimage: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80",
    },
  ],
};

const seedBanners = [
  {
    title: "⚡ Grand Luxe Summer Sale — Up to 40% Off",
    description: "Upgrade your lifestyle with top-tier smartphones, flagship laptops, and luxury timepieces.",
    imageurl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "🎧 Studio Quality Audio Experience",
    description: "Immerse yourself in world-class noise cancellation headphones and audiophile gear.",
    imageurl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "⌚ Timeless Elegance & Precision",
    description: "Explore our curated collection of luxury watches and premium lifestyle accessories.",
    imageurl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
  },
];

async function runSeedScript() {
  try {
    console.log("Connecting to database:", DB);
    await mongoose.connect(DB);

    console.log("🔥 Wiping out all existing collections...");
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Category.deleteMany({}),
      Order.deleteMany({}),
      Cart.deleteMany({}),
      Wishlist.deleteMany({}),
      Banner.deleteMany({}),
      Review.deleteMany({}),
      Coupon.deleteMany({}),
    ]);
    console.log("✅ Collections cleared!");

    console.log("ℹ️ User creation skipped so users can register via website UI.");

    console.log("\n🌱 Uploading & Seeding Categories & Products to Cloudinary...");

    let totalProductsSeeded = 0;

    for (const catData of seedCategories) {
      console.log(`\n📂 Processing Category: "${catData.name}"...`);
      // Upload category image to Cloudinary
      const categoryCloudinaryUrl = await uploadImageToCloudinary(catData.imageurl, "luxe_categories");
      
      const createdCategory = await Category.create({
        name: catData.name,
        imageurl: categoryCloudinaryUrl,
      });

      const productsForCat = seedProductsData[catData.name] || [];
      const preparedProducts = [];

      for (const p of productsForCat) {
        console.log(`   └─ Uploading product image to Cloudinary: ${p.name}`);
        const productCloudinaryUrl = await uploadImageToCloudinary(p.productimage, "luxe_products");
        preparedProducts.push({
          name: p.name,
          pdescription: p.pdescription,
          price: p.price,
          mainStock: p.mainStock,
          catid: createdCategory._id,
          productimage: productCloudinaryUrl,
        });
      }

      if (preparedProducts.length > 0) {
        await Product.insertMany(preparedProducts);
        totalProductsSeeded += preparedProducts.length;
        console.log(`   ✅ Inserted ${preparedProducts.length} products with Cloudinary image URLs.`);
      }
    }

    console.log("\n🌱 Seeding Promotional Banners to Cloudinary...");
    const preparedBanners = [];
    for (const b of seedBanners) {
      const bannerCloudinaryUrl = await uploadImageToCloudinary(b.imageurl, "luxe_banners");
      preparedBanners.push({
        title: b.title,
        description: b.description,
        imageurl: bannerCloudinaryUrl,
      });
    }
    await Banner.insertMany(preparedBanners);
    console.log(`  ✅ Inserted ${preparedBanners.length} promotional banners.`);

    console.log("\n🌱 Creating sample customer order...");
    console.log("ℹ️ Order creation skipped.");

    console.log(`\n🎉 PRO E-COMMERCE SEEDING COMPLETED SUCCESSFULLY!`);
    console.log(`   Total Categories: ${seedCategories.length}`);
    console.log(`   Total Products: ${totalProductsSeeded}`);
    console.log(`   All images uploaded and stored in Cloudinary!`);

  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

runSeedScript();
