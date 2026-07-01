import DBConnection from "@/utils/config/databse";
import BookModel from "@/utils/config/models/book";

export default async function bookproduct() {
  await DBConnection();

  const getBooks = await BookModel.find({});

  return (
    <>
      {getBooks.map((item) => {
        return (
          <div key={item._id}>
            <div>{item.title}</div>
            <div>{item.model}</div>
            <div>{item.price}</div>
            <hr />
          </div>
        );
      })}
    </>
  );
}
