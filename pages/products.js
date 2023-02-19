import { app, h } from 'hyperapp';
import './products.css';

const Fragment = (props, children) => children;

const Product = ({ product, newProduct, input, createNewSession, isAdmin, fn }) => {
  let price;
  let registeredAccount;
  return (
    <>
      {product ? (
        <div class='card product'>
          <div class='card-header'>
            <strong>Price this product</strong>
          </div>
          <div class='card-body'>
            <img
              class='rounded float-left product-image'
              src={
                product.productImages.toString().startsWith('http')
                  ? product.productImages.toString()
                  : '//robohash.org/' + product.productImages + '?set=set4&bgset=bg2'
              }
            ></img>
            <dl class='row'>
              <dt class='col-sm-4'>Product Name</dt>
              <dd class='col-sm-8'>
                <h5>{product.productName}</h5>
              </dd>

              <dt class='col-sm-4'>Description</dt>
              <dd class='col-sm-8'>
                <p>{product.productDescription}</p>
              </dd>

              <dt class='col-sm-4'>Proposed Price</dt>
              <dd class='col-sm-8'>
                <p>$ {product.proposedPrice}</p>
              </dd>

              <dt class='col-sm-4'>Status</dt>
              <dd class='col-sm-8'>
                <p>{product.status}</p>
              </dd>
              <dt class='col-sm-4'>No Registered Participnats</dt>
              <dd class='col-sm-8'>
                <p>{product.noRegisteredParticipants}</p>
              </dd>
              <dt class='col-sm-4'>No Priced Participnats</dt>
              <dd class='col-sm-8'>
                <p>{product.noPricedParticipants}</p>
              </dd>
            </dl>
          </div>
          {isAdmin ? (
            <div class='card-footer'>
              <div class='input-group'>
                <div class='input-group-prepend'>
                
                  <button
                    class='btn btn-outline-primary'
                    type='button'
                    onclick={e => fn({ action: 'Register Participants', data: registeredAccount })}
                  >
                    Register
                  </button>
                 
                  <button
                    class='btn btn-outline-primary'
                    type='button'
                    onclick={e => fn({ action: 'Start a pricing session', data: '' })}
                  >
                    Start
                  </button>
                  <button
                    class='btn btn-outline-primary'
                    type='button'
                    onclick={e => fn({ action: 'Closing session', data: '' })}
                  >
                    Closing
                  </button>
                  <input
                    type='text'
                    class='form-control'
                    id = 'register'
                    placeholder='Account Address'
                    oninput={e => (registeredAccount = e.target.value)}

                  />
                  
                </div>
                
                <div class='input-group-append margin2'>
                  <button
                    class='btn btn-outline-primary'
                    type='button'
                    onclick={e => fn({ action: 'Close and Calculate Proposed Price', data: '' })}
                  >
                    Close & Calculate Proposed Price
                  </button>
                  
                  
                  <button
                    class='btn btn-outline-primary'
                    type='button'
                    onclick={e => fn({ action: 'Set a final price and Update deviation', data: price })}
                  >
                    Set Final Price
                  </button>

                  <input
                    type='number'
                    class='form-control'
                    placeholder='price'
                    oninput={e => (price = e.target.value)}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div class='card-footer'>
              <div class='input-group'>
                <input
                  type='number'
                  class='form-control'
                  placeholder='price'
                  oninput={e => (price = e.target.value)}
                />
                <div class='input-group-append'>
                  <button 
                  class='btn btn-primary' 
                  type='button'
                  onclick={e => fn({ action: 'Price a Product', data: price })}
                  >
                    Price this product
                  </button>
                </div>
              </div>


            </div>

          )}
        </div>
      ) : (
        <></>
      )}

      <div>
        {isAdmin ? (    
      <div class='card'>
        <div class='card-header'>
          <strong>Create new session</strong>
        </div>
        <div class='card-body'>
          <div class='row'>
            <div class='col-sm-12'>
              <div class='form-group'>
                <label for='name'>Product name</label>
                <input
                  type='text'
                  class='form-control'
                  id='productName'
                  value={newProduct.productName}
                  oninput={e => {
                    input({ field: 'productName', value: e.target.value });
                  }}
                />
              </div>
            </div>
          </div>

          <div class='row'>
            <div class='col-sm-12'>
              <div class='form-group'>
                <label for='description'>Product description</label>
                <input
                  type='text'
                  class='form-control'
                  id='productDescription'
                  value={newProduct.productDescription}
                  oninput={e => {
                    input({ field: 'productDescription', value: e.target.value });
                  }}
                />
              </div>
            </div>
          </div>

          <div class='row'>
            <div class='col-sm-12'>
              <div class='form-group'>
                <label for='image'>Product image</label>
                <input
                  type='text'
                  class='form-control'
                  id='productImages'
                  placeholder='http://'
                  value={newProduct.productImages}
                  oninput={e => {
                    input({ field: 'productImages', value: e.target.value });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div class='card-footer'>
          <button type='submit' class='btn btn-primary' onclick={createNewSession}>
            Create
          </button>
        </div>
      </div>):(<>
        
      </>)}
      </div>

      
  
    </>
  );
};

const ProductRow = ({ product, index, select, currentIndex }) => (
  <tr
    onclick={e => select(index)}
    class={index === currentIndex ? 'active' : ''}
  >
    <th scope='row'>{product.no}</th>
    <td>{product.productName}</td>
    <td>{product.productDescription} </td>
    <td>$ {product._finalPrice}</td>
    <td>{product.status}</td>
  </tr>
);
const Products = ({ match }) => (
  { newProduct, sessions, currentProductIndex, isAdmin },
  { inputNewProduct, createNewSession, selectProduct, sessionFn }
) => {
  return (
    <div class='d-flex w-100 h-100'>
      <div class='bg-white border-right products-list'>
        <table class='table table-hover table-striped'>
          <thead>
            <tr>
              <th scope='col'>#</th>
              <th scope='col'>Product</th>
              <th scope='col'>Description</th>
              <th scope='col'>Final price</th>
              <th scope='col'>Status</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((p, i) => {
              p.no = i + 1;
              return (
                <ProductRow
                  product={p}
                  index={i}
                  select={selectProduct}
                  currentIndex={currentProductIndex}
                  isAdmin={isAdmin}
                ></ProductRow>
              );
              // return ProductRow(p, i, selectProduct, currentProductIndex);
            })}
          </tbody>
        </table>
      </div>
      <div class='pl-2 flex product-detail'>
        <Product
          newProduct={newProduct}
          input={inputNewProduct}
          createNewSession={createNewSession}
          product={sessions[currentProductIndex]}
          isAdmin={isAdmin}
          fn={sessionFn}
        ></Product>
      </div>
    </div>
  );
};

export { Products };
