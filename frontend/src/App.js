import React,{useState} from 'react';

const App = ()=>{
    const[hashtag, setHashtag] = useState('');
    const [tweets, setTweets] = useState([]);
    const[loading, setLoading] = useState(false);
    const[error, setError] = useState('');

     // Fetch tweets from the back-end
     const fetchTweets = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
          const response = await fetch(`http://localhost:5000/api/news/${hashtag}`);
          if (!response.ok) {
            throw new Error('Failed to fetch tweets');
          }
          const data = await response.json();
          setTweets(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
          <h1 className="text-3xl font-bold mb-6 text-blue-500">Tweet Summarizer</h1>
          <form onSubmit={fetchTweets} className="w-full max-w-md flex items-center gap-2">
            <input
              type="text"
              placeholder="Enter hashtag (e.g., technology)"
              value={hashtag}
              onChange={(e) => setHashtag(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded shadow-sm"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Search
            </button>
          </form>
    
          {loading && <p className="mt-4 text-gray-500">Loading tweets...</p>}
          {error && <p className="mt-4 text-red-500">{error}</p>}
    
          <div className="mt-8 w-full max-w-2xl space-y-4">
            {tweets.map((tweet) => (
              <div
                key={tweet.id}
                className="p-4 bg-white shadow rounded border border-gray-200"
              >
                <p className="text-gray-800"><strong>Original:</strong> {tweet.original}</p>
                <p className="text-gray-600 mt-2"><strong>Summary:</strong> {tweet.summary}</p>
              </div>
            ))}
          </div>
        </div>
      );
    };

    export default App;