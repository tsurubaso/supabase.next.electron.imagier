export default function HomePage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("stories") // Ensure you have a 'stories' table
        .select('id, timelineStart, timelineEnd, description'); // Fetch relevant columns

      if (error) {
        console.error('Error fetching data:', error);
        return;
      }

      const timelineItems = data
        .filter(item => item.timelineStart) // Filter out items with null or undefined timelineStart
        .map((item) => ({
          id: item.id,
          content: item.description,
          start: new Date(item.timelineStart).toISOString(),
          end: item.timelineEnd ? new Date(item.timelineEnd).toISOString() : undefined,
          // Add other properties if necessary
        }));

      setItems(timelineItems);
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <NavBar />
      <div className="max-w-8xl mx-auto"> {/* Increased max-width */}
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-8">
          Timeline
        </h1>
        <div className="h-800 w-full"> {/* Apply desired height and width */}
          <TimelineComponent items={items} />
        </div>
      </div>
    </div>
  );
}
