import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";


const app = express();
const port = process.env.PORT || 3000;

// const toDoItems = [];
// const workItems = [];

const theTodolistDB = async () => {
    try {
        await mongoose.connect("mongodb://0.0.0.0:27017/todolistDB");
        console.log("Connected to database");

        const itemSchema = new mongoose.Schema({name: String});

        const Item = mongoose.model("Item", itemSchema);
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    const listDate = new Date().toLocaleDateString(undefined, options);
    res.render("index.ejs", {
        listTitle: listDate,
        newListItems: toDoItems
    });
});

app.post("/", (req, res) => {
    const item = req.body.newItem;
    if (req.body.list === "Work List") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        toDoItems.push(item);
        res.redirect("/");
    }
});

app.get("/work", (req, res) => {
    res.render("index.ejs", {
        listTitle: "Work List",
        newListItems: workItems
    });
});

app.listen(port, () => {
    console.log(`Listing on port ${port}`);
})