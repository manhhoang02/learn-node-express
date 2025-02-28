import express from "express";
import { connect, model } from "mongoose";

/* Mongoose */
connect("mongodb://localhost/myapp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Kết nối MongoDB thành công!"))
  .catch((err) => console.error("Lỗi kết nối MongoDB:", err));

const User = model("User", { name: String });
const Todo = model("Todo", { id: Number, name: String });

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

/* routing */
app.get("/welcome", (req, res) => {
  res.send("Chào mừng bạn đến với khóa học!");
});

app.get("/about", (req, res) => {
  res.send("Đây là trang giới thiệu về chúng tôi!");
});

app.get("/contact", (req, res) => {
  res.send("Liên hệ với chúng tôi!");
});

/* path params */
app.get("/user/:id", (req, res) => {
  res.send("Xin chào, user có id là " + req.params.id);
});

// query string
app.get("/product", (req, res) => {
  const productId = req.query.id;
  res.send("Thông tin sản phẩm có id: " + productId);
});
// -> http://localhost:3000/product?id=123

app.get("/search", (req, res) => {
  const { keyword, sort } = req.query;
  res.send(`Bạn đang tìm kiếm: ${keyword} và sắp xếp theo: ${sort}`);
});
// -> http://localhost:3000/search?q=nodejs&sort=asc

/* create api */
const users = [
  { id: 1, name: "John" },
  { id: 2, name: "Jane" },
  { id: 3, name: "Doe" },
];

const products = [
  { id: 1, name: "iPhone 12", price: 1000 },
  { id: 2, name: "Samsung Galaxy S21", price: 900 },
  { id: 3, name: "Google Pixel 5", price: 800 },
];

// users api
app.get("/api/users", (req, res) => {
  res.json(users);
});
// -> http://localhost:3000/api/users

app.get("/api/users/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).send("Không tìm thấy người dùng");
  }
  res.json(user);
});
// -> http://localhost:3000/api/users/1

// products api
app.get("/api/products", (req, res) => {
  const { sort } = req.query;
  // sort products by price
  if (sort === "asc") {
    products.sort((a, b) => a.price - b.price);
  } else if (sort === "desc") {
    products.sort((a, b) => b.price - a.price);
  }
  res.json(products);
});

app.get("/api/products/:id", (req, res) => {
  const productId = req.params.id;
  const product = products.find((p) => p.id === parseInt(productId));
  if (!product) {
    return res.status(404).send("Không tìm thấy sản phẩm");
  }
  res.json(product);
});

// add user
app.get("/api/add-user", async (req, res) => {
  const user = new User({ name: "Hùng" });
  await user.save();
  res.send("Đã thêm người dùng!");
});

// add 3 todos
app.get("/api/add-todo", async (req, res) => {
  // const todo = new Todo({ name: "Viết bài blog" });
  const todos = [
    { id: 1, name: "Viết bài blog" },
    { id: 2, name: "Làm bài tập" },
    { id: 3, name: "Đọc sách" },
  ];
  // await todo.save();
  await Todo.insertMany(todos);
  res.send("Đã thêm công việc!");
});

// get all todos
app.get("/api/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// delete todo by id
app.get("/api/delete-todo/:id", async (req, res) => {
  const { id } = req.params;
  await Todo.deleteOne({ id: parseInt(id) });
  res.send("Đã xóa công việc!");
});

/* start server */
app.listen(3000, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
