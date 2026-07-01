import DBConnection from "@/utils/config/databse";
import BookModel from "@/utils/config/models/book";

const page = () => {
  const BookHandler = async (formdata) => {
    "use server";
    await DBConnection();

    let title = formdata.get("title");
    let model = formdata.get("model");
    let price = formdata.get("price");

    await BookModel.create({ title: title, model: model, price: price });

    console.log("Book is Added");
  };
  return (
    <div>
      <form action={BookHandler}>
        <h1>Server-Action using next js</h1>
        <input type="text" name="title" />
        <br />
        <input type="text" name="model" />
        <br />
        <input type="text" name="price" />
        <br />
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
};
export default page;
