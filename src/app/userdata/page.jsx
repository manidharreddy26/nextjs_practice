const url = "https://jsonplaceholder.typicode.com/posts";

export const sampledata = async () => {
  const response = await fetch(url);
  return response.json();
};

const page = async () => {
  const data = await sampledata();

  return (
    <div>
      {data.map((ele, index) => {
        return (
          <div key={ele.id}>
            Index_No:-{`${index + 1}`}
            <br />
            Title:- {`${ele.title}`}
            <br />
            Body:- {`${ele.body}`}
            <hr />
          </div>
        );
      })}
    </div>
  );
};

export default page;
