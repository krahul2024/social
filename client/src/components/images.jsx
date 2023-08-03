import React from 'react' 

const Image = ({path , ...rest}) => {
	// console.log({path})
	const source = path?.includes('https') ? path : `http://localhost:5000/uploads/${path}`; 
	return (<>
		<img src={source} {...rest} />
	 </>)
}

export default Image;