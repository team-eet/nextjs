import Link from "next/link";

import {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";

import CartItems from "./CartItems";
import Axios from "axios";
import {API_URL, API_KEY} from "../../constants/constant";
import {
  Row,
  Col,
  Input,
  CustomInput,
    Form
} from 'reactstrap'
import { ErrorDefaultAlert } from "@/components/Services/SweetAlert";

const CartPage = () => {
  const dispatch = useDispatch();
  const { cart, total_amount, shipping_fee } = useSelector(
    (state) => state.CartReducer
  );

  const REACT_APP = API_URL
  const [courseitem, setcourseitem] = useState([])
  const [handleGST, sethandleGST] = useState('')
  const [showTax, setshowTax] = useState(false)


  const handleChangeGST = (e) => {

      if (e.target.checked) {
        setshowTax(true)
        // this.setState({ showTax: true })
      } else {
        setshowTax(false)
      }
      sethandleGST(e.target.checked)
      // this.setState({ handleGST : e.target.checked })
  }
  let checkoutAmount = 0
  useEffect(() => {
    dispatch({ type: "COUNT_CART_TOTALS" });
    localStorage.setItem("hiStudy", JSON.stringify(cart));

    if (localStorage.getItem('userData')) {
      const udata = JSON.parse(localStorage.getItem('userData'))

      //get cart data from db
      Axios.get(`${API_URL}/api/cart/GetCartItem/${udata['regid']}`, {
        headers: {
          ApiKey: `${API_KEY}`
        }
      })
          .then(res => {
            if (res.data) {
              // console.log(res.data)
              if (res.data.length !== 0) {

                const newcartlist = res.data.filter((v, i, a) => a.findIndex(t => ((t.cid === v.cid) && (t.pkgId === v.pkgId))) === i)
                // console.log(newcartlist)
                setcourseitem(newcartlist)
                localStorage.removeItem('cart')
                localStorage.setItem('cart', JSON.stringify(newcartlist))

              }
            }
          })
          .catch(err => {
            { ErrorDefaultAlert(err) }
          })

    } else if (localStorage.getItem('cart')) {
      setcourseitem(JSON.parse(localStorage.getItem('cart')))

      // console.log('cart')
    }
  }, [cart]);

  return (
    <>
      <div className="cart_area">
        <div className="container">
          {courseitem.length !== 0 ? <>
            <div className="row">
              <div className="col-lg-8">
                {/*<Form>*/}
                  <div className="cart-table table-responsive mb--60">
                    <table className="table">
                      <thead>
                      <tr>
                        <th className="pro-thumbnail">Image</th>
                        <th className="pro-title">Product</th>
                        <th className="pro-price">Price</th>
                        {/*<th className="pro-quantity">Quantity</th>*/}
                        <th className="pro-subtotal">Total</th>
                        <th className="pro-remove">Remove</th>
                      </tr>
                      </thead>
                      <tbody>
                      {courseitem.map((item, index) => {
                        const userPay = (parseInt(item.pay_price) - (parseInt(item.pay_price) * parseInt(item.discount) / 100))
                        // console.log(userPay, pay_amnt)
                        const pay_amnt = parseInt(item.pay_price) - parseInt(item.user_pay)
                        // console.log(pay_amnt)
                        checkoutAmount += userPay
                        return <CartItems cartitem={courseitem} index={index} checkoutAmount={checkoutAmount} key={index} product={item} />;
                      })}

                      </tbody>
                    </table>
                  </div>
                {/*</Form>*/}

                {/*<div className="row g-5">*/}

                {/*</div>*/}
              </div>

              <div className="col-lg-4">
                <div className="cart-summary">
                  <div className="cart-summary-wrap">
                    <div className="section-title text-start">
                      <h4 className="title mb--30">CartPage Summary</h4>
                    </div>
                    <div className="">
                      <div className="section-title text-start">
                        <h6 className="">Discount Coupon Code</h6>
                      </div>
                      <Form>
                        <div className="row">
                          <div className="col-md-6 col-12 mb--25">
                            <input type="text" placeholder="Coupon Code"/>
                          </div>
                          <div className="col-md-6 col-12 mb--25">
                            <button className="rbt-btn btn-gradient hover-icon-reverse btn-sm">
                            <span className="icon-reverse-wrapper">
                              <span className="btn-text" style={{fontSize: '14px'}}>Apply Code</span>
                              <span className="btn-icon">
                                <i className="feather-arrow-right"></i>
                              </span>
                              <span className="btn-icon">
                                <i className="feather-arrow-right"></i>
                              </span>
                            </span>
                            </button>
                          </div>
                        </div>
                      </Form>
                    </div>
                    <Row>
                      <Col lg={10} md={10} sm={10} className="align-self-center">
                        <p> Do you claim GST?</p>
                      </Col>
                      <Col lg={2} md={2} sm={2}>
                        <input
                            id={`cat-list`}
                            type="checkbox"
                            className={'mt-4'}
                            value={handleGST}
                            onChange={handleChangeGST}
                            name={`cat-list`}
                            style={{opacity: '1', position: 'relative', height: '15px'}}/>
                      </Col>
                      {showTax ? <>
                        <Col>
                          <input type="text" placeholder="Enter GST Number"/>
                        </Col>
                      </> : <></>}

                    </Row>

                    {handleGST ? <>
                      <p>
                        Sub Total <span>₹{((checkoutAmount * 100) / (100 + 18)).toFixed(2)}</span>
                      </p>
                    </> : <>
                      <p>
                        Sub Total <span>₹ {checkoutAmount}</span>
                      </p>
                    </>}
                    {showTax ? <>

                      <Row>
                        <Col lg={9} className="align-self-center">
                          <div
                              className='detail-title font-weight-bolder lh-16 font-15'>Tax:
                          </div>
                        </Col>
                        <Col lg={3} className="text-end">
                          <span className={'font-15'}>
                            ₹ {parseFloat((checkoutAmount) - ((checkoutAmount * 100) / (100 + 18))).toFixed(2)}
                          </span>
                        </Col>
                      </Row>
                    </> : <></>}
                    <h2>
                      Grand Total{" "}
                      <span>₹ {checkoutAmount}</span>
                    </h2>
                    <div className="mt-5">
                      <div className="single-button">
                        <Link
                            href="/checkout"
                            className="rbt-btn btn-gradient rbt-switch-btn rbt-switch-y w-100 text-center"
                        >
                          <span data-text="Checkout">Checkout</span>
                        </Link>
                      </div>
                    </div>
                  </div>


                </div>
              </div>
            </div>
          </> : <>
            <h4 className={'text-center'}>Cart is empty!</h4>
          </>}

        </div>
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(CartPage), {ssr: false});
