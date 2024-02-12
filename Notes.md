<h1>Types of middleWare</h1>

<ol>
<li>Body middleware</li>
<li>Simple/Normal middleware</li>
<li>Param middleware</li>
<li>Morgan Middleware</li>
<li>Router middleware</li>
<li>Middle ware to check the (post) body structure</li>
<li>Serving static files (like html , images)</li>

</ol>

<h1>Environment Variables</h1>
1- Different Databases
2- Logging on & off
They are based on environment variables

console.log(process.env)
NODE_ENV = development nodemon server.js

<h1>Steps to integrate eslint</h1>
<ol>
  <li>npm i eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-config-airbnb eslint-plugin-node eslint-plugin-import eslint-plugin-jsx-a11y
  eslint-plugin-react --save-dev</li>
</ol>

<h1>Mongoose Connection</h1>

```
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false, // Add this line to address another deprecation warning
    });

    console.log(conn.connections);
    console.log('Database is connected');
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
```

<h1>Operations on data base</h1>

```
const createTour = new Tour(req.body);
const saveTour = await createTour.save();

1)Tour.create();
2)Tour.DeleteMany()
3)Tour.find()
4)Tour.findById()
5)Tour.findByIdAndUpdate()
6)Tour.findByIdAndRemove()
```
