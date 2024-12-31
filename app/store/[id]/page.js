import Image from 'next/image';

const sellerData = {
  name: "John Doe",
  profilePicture: "/noavatar.png", // Replace with actual path
  description: "Professional seller with a wide range of products in electronics and accessories.",
};

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    image: "/path/to/product1.jpg",
    price: "$50.00",
  },
  {
    id: 2,
    name: "Smartwatch",
    image: "/path/to/product2.jpg",
    price: "$120.00",
  },
  {
    id: 3,
    name: "Bluetooth Speaker",
    image: "/path/to/product3.jpg",
    price: "$30.00",
  },
  // Add more products as needed
];

const SellerPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Seller Details */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-24 h-24 relative">
          <Image
            src={sellerData.profilePicture}
            alt={`${sellerData.name}'s profile picture`}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{sellerData.name}</h1>
          <p className="text-gray-600">{sellerData.description}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Products</h2>
    </div>
  );
};

export default SellerPage;
