// const app = express();
// app.use(express.json());

// const users: { [key: string]: string } = {};
// app.post("/add-user", (req, res) => {
//   const { id, username } = req.body;
//   if (!id || !username) {
//     return res.status(404).json({
//       message: "Username or Id not present",
//     });
//   }

//   users[id] = username;
//   const token = jwt.sign({ username, id }, "secret_key");
//   return res.status(200).json({
//     message: "User added",
//     token,
//   });
// });

// app.listen(3000, () => console.log("Server listening on port 3000"));