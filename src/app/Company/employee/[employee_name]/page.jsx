const page = async ({ params }) => {
  const { employee_name } = await params;
  return (
    <div>
      <h1>Hi i am from ASCENTRAA Company and my name is {employee_name}</h1>
    </div>
  );
};

export default page;
