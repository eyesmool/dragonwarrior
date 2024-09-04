const parseGraphics = async () => {
    try {
        // Fetch the file from the public directory
        const response = await fetch('/graphics.txt');
        
        // Check if the response is okay (status code 200-299)
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Get the text content of the file
        const data = await response.text();

        // Process the data
        const dataArray = data.trim().split('\n').map(JSON.parse);
        const graphicsMap = new Map(dataArray.map((item) => [item.character, item]));
        return graphicsMap;
    } catch (error) {
        console.error('Failed to fetch and parse graphics.txt:', error);
    }
};

export { parseGraphics };
