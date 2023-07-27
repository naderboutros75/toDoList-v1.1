import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 3000;

const toDoItems = [];
const workItems = [];

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