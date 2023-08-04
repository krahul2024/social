import React from 'react' 

const Image = ({path , ...rest}) => {
	// console.log({path})
	return (<>
		<img src={path} {...rest} />
	 </>)
}

export default Image;