import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import ImageUploader from 'react-images-upload';

class analysticPage extends Component {
  constructor(props) {
       super(props);
        this.state = {
          pictures: [],
          // picturees2: null,
         };
        this.onDrop = this.onDrop.bind(this);
   }

   onDrop(picture) {
       this.setState({
           pictures: this.state.pictures.concat(picture),
           // pictures2: URL.createObjectURL(this.state.pictures.concat(picture))
       });
   }


   render() {
     let {beer} = this.state.pictures.length !== 0 ? this.state.pictures[0] : "";

      return (
         <div>

         <ImageUploader
             withIcon={true}
             buttonText='Choose images'
             onChange={this.onDrop}
             imgExtension={['.jpg', '.gif', '.png', '.gif']}
             maxFileSize={5242880}
         />


         <img src={ this.state.pictures } alt="beer" />


           <p className="airCenter">AnalysticPage Under Construction</p>

           <Button bsStyle="primary">Okay</Button>

         </div>
      );
   }
}
export default analysticPage;
