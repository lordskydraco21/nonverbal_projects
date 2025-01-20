import React from 'react';

interface DownloadButtonProps {
    data: any; // Use 'any' type if the structure of the data can vary
    filename: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ data, filename }) => {
    const handleDownload = () => {
        if (!data) {
            console.error('No data to download.');
            return;
        }

        try {
            const jsonData = JSON.stringify(data, null, 2); // Pretty print JSON with indent of 2
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `${filename}.json`;
            document.body.appendChild(link); // Required for Firefox
            link.click();

            URL.revokeObjectURL(url); // Clean up the URL object
            document.body.removeChild(link);

        } catch (err) {
             console.error('Error downloading the json file.', err);
        }

    };

    return (
        <button onClick={handleDownload}>Download JSON</button>
    );
};

export default DownloadButton;