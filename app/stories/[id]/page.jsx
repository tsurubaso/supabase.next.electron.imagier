import NavBar from '../../../components/NavBar';
async function Page({ params }){

    const { id } = await params

  return (
    <div>
      <NavBar />
      <div className="p-8">
        {/* Existing Story Detail Content */}
        <h1>Story ID: {id}</h1>
      </div>
    </div>
  );
};

export default Page;