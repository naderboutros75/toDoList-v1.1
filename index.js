import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import _ from "lodash";


const app = express();
const port = process.env.PORT || 3000;

const itemSchema = new mongoose.Schema({ name: String });
const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({ name: "nader" });
const item2 = new Item({ name: "besbesa" });
const item3 = new Item({ name: "nermine" });

const defualtItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema]
});
const List = mongoose.model("List", listSchema);

const theTodolistDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://admin-nader:Godzilla1975@cluster0.kfefuuh.mongodb.net/todolistDB");
        console.log("Connected to database");
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
    try {
        const itemsList = await Item.find({});
        if (itemsList.length === 0) {
            await Promise.all([
                item1.save(),
                item2.save(),
                item3.save()
            ]);
            console.log("Items are saved to database.");
            res.redirect("/") // redirecting back home page after saving all three items in DB
        } else {
            res.render("index.ejs", {
                listTitle: "Today",
                newListItems: itemsList
            });
        };
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/:customListName", async (req, res) => {
    const customListName = _.capitalize(req.params.customListName);
    try {
        const foundList = await List.findOne({ name: customListName });
        if (!foundList) {
            const list = new List({
                name: customListName,
                items: defualtItems
            });
            await list.save();
            res.redirect("/" + customListName);
        } else {
            res.render("index.ejs", {
                listTitle: foundList.name,
                newListItems: foundList.items
            });
        }
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/", async (req, res) => {
    if (req.body.list === "Today") {
        await new Item({ name: req.body.newItem }).save();
        res.redirect("/");
    } else {
        try {
            const foundList = await List.findOne({ name: req.body.list });
            if (foundList) {
                foundList.items.push({ name: req.body.newItem }); // Push the new item object
                await foundList.save();
                res.redirect("/" + req.body.list);
            }
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send("Internal Server Error");
        }
    }
});

app.post("/delete", async (req, res) => {
    const listName = req.body.listName;
    if (listName === "Today") {
        await Item.findByIdAndDelete(req.body.checkbox);
        res.redirect("/");
    } else {
        try {
            const foundList = await List.findOne({ name: listName });
            if (foundList) {
                await foundList.updateOne({ $pull: { items: { _id: req.body.checkbox } } });
                res.redirect("/" + listName);
            }
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send("Internal Server Error");
        }
    }
});


app.listen(port, async () => {
    await theTodolistDB();
    console.log(`Listing on port ${port}`);
})