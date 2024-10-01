import React from 'react';

import './Error.css'

function ErrorPage() {
  return (
    <div className="error-page">
      <div>
        <h1>Error 404</h1>
        <p>La página a la que quiere acceder se encuentra en construcción</p>
        <a href="/">Volver a la tienda</a>
      </div>
    </div>
  );
}


export default ErrorPage;
