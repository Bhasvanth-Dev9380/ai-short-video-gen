import React from 'react';
import Image from 'next/image';

function CustomLoading({ loading }) {
  if (!loading) return null; // Only show the component when loading is true

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white px-20 py-10 rounded-md flex flex-col items-center my-10 justify-center">
        <Image src={'/progress.gif'} alt="Loading" width={100} height={100} />
        <h2 className="mt-4 text-lg font-medium text-gray-700">Generating your video... Do not Refresh</h2>
      </div>
    </div>
  );
}

export default CustomLoading;
