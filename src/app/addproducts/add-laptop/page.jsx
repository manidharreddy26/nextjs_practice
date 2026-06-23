// "use client";

// import { useState } from "react";
// import styles from "../products.module.css";

// const Page = () => {
//   const [title, settitle] = useState("");
//   const [model, setmodel] = useState("");
//   const [price, setprice] = useState("");

//   const laptopDataHandler = async (e) => {
//     e.preventDefault();

//     const response = await fetch("http://localhost:3000/api/products/laptops", {
//       method: "POST",
//       hearder:{
//         "content-type": "application/json"
//       },
//       body: JSON.stringify({
//         title,
//         model,
//         price,
//       }),
//     });
//     if (response.ok) {
//       alert("Laptop is Added Successfully");
//     }
//     settitle("");
//     setmodel("");
//     setprice("");
//   };
//   return (
//     <div>
//       <form className={styles.formSection} onSubmit={laptopDataHandler}>
//         <div className={styles.fromInp}>
//           <h3>Laptop Title as Name</h3>
//           <input
//             type="text"
//             value={title}
//             onChange={(e) => settitle(e.target.value)}
//           />
//         </div>
//         <div className={styles.fromInp}>
//           <h3>Laptop Model</h3>
//           <input
//             type="text"
//             value={model}
//             onChange={(e) => setmodel(e.target.value)}
//           />
//         </div>
//         <div className={styles.fromInp}>
//           <h3>Laptop Price</h3>
//           <input
//             type="text"
//             value={price}
//             onChange={(e) => setprice(e.target.value)}
//           />
//         </div>
//         <button type="submit" className={styles.formBtn}>
//           Add Laptop
//         </button>
//       </form>
//     </div>
//   );
// };
// export default Page;

"use client";

import { useState } from "react";
import styles from "../products.module.css";

const page = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [title, settitle] = useState("");
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [model, setmodel] = useState("");
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [price, setprice] = useState("");

  const laptopDataHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/products/laptops", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          model,
          price,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Laptop is Added Successfully");

        settitle("");
        setmodel("");
        setprice("");
      } else {
        alert(result.message || "Laptop was not added");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <div>
      <form className={styles.formSection} onSubmit={laptopDataHandler}>
        <h1> Add Laptop In Database</h1>
        <br />
        <div className={styles.fromInp}>
          <h3>Laptop Title as Name</h3>
          <input
            type="text"
            value={title}
            onChange={(e) => settitle(e.target.value)}
            required
          />
        </div>

        <div className={styles.fromInp}>
          <h3>Laptop Model</h3>
          <input
            type="text"
            value={model}
            onChange={(e) => setmodel(e.target.value)}
            required
          />
        </div>

        <div className={styles.fromInp}>
          <h3>Laptop Price</h3>
          <input
            type="number"
            value={price}
            onChange={(e) => setprice(e.target.value)}
            required
          />
        </div>

        <button type="submit" className={styles.formBtn}>
          Add Laptop
        </button>
      </form>
    </div>
  );
};

export default page;
