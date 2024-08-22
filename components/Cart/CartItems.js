import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import Axios from 'axios'
import { EncryptData, DecryptData } from "@/components/Services/encrypt-decrypt";
import { ErrorDefaultAlert, ErrorAlert} from "@/components/Services/SweetAlert";
import { deleteProduct, toggleAmount } from "@/redux/action/CartAction";
import {API_URL} from "../../constants/constant";
import { useState } from "react";
import { toast } from 'react-toastify'
import { ErrorMessageToast } from "@/components/Services/Toast";

const CartItems = ({ id, product, amount, checkoutAmount, index, cartitem }) => {
    // console.log(id, product, amount)
  const dispatch = useDispatch();
  const REACT_APP = API_URL
    const [courseitem, setcourseitem] = useState([])
    const [wishlist, setwishlist] = useState([])
  const handleRemoveItem = (cartId, cid, pkgid) => {
      if(localStorage.getItem('userData')){
          const udata = JSON.parse(localStorage.getItem('userData'))
          Axios.delete(`${REACT_APP.API_URL}/api/cart/DeleteCart/${EncryptData(cartId)}/${udata['regid']}`, {
              headers: {
                  ApiKey: `${REACT_APP.API_KEY}`
              }
          })
              .then(res => {
                  const retData = JSON.parse(res.data)

                  if (retData.success === "1") {
                      Axios.get(`${REACT_APP.API_URL}/api/cart/GetCartItem/${udata['regid']}`, {
                          headers: {
                              ApiKey: `${REACT_APP.API_KEY}`
                          }
                      })
                          .then(res => {
                              if (res.data) {
                                  // console.log(res.data)
                                  if (res.data.length !== 0) {
                                      const newcartlist = res.data.filter((v, i, a) => a.findIndex(t => ((t.cid === v.cid) && (t.pkgId === v.pkgId))) === i)
                                      setcourseitem(newcartlist)
                                      localStorage.removeItem('cart')
                                      localStorage.setItem('cart', JSON.stringify(newcartlist))
                                  }
                              }
                          })
                          .catch(err => {
                              { ErrorDefaultAlert(err) }
                          })
                  } else { { ErrorAlert(retData) } }
              })
              .catch(err => {
                  { ErrorDefaultAlert(err) }
              })
      }
      // setcourseitem((state) => {
      //     state.courseitem.filter((item, i) => i != cid)
      // })
      // setcourseitem((state) => {
      //      state.courseitem.filter((item, i) => i !== cid)
      // }, () => {
      //     localStorage.setItem('cart', JSON.stringify(this.state.courseitem))
      // })

      if (courseitem.length === 1) {
          localStorage.removeItem('cart')
          this.setState(state => ({
              courseitem: []
          }), () => {

          })
      }
  }

  const handleWishlistCartItem = (index, cid) => {
      // window.location.reload(true)
      // console.log(index, cid)

            //get wishlist item count
            let wishlistitemcnt = 0
            if (localStorage.getItem('wishlist')) {
                const str_arr = JSON.parse(localStorage.getItem('wishlist'))
                if (str_arr.length !== 0) {
                    wishlistitemcnt = str_arr.length
                }
            }

            //get maximum wishlist item count
            let maximumItemWishlist = 0
            Axios.get(`${REACT_APP.API_URL}/api/companySettings/FillCompanySettings`, {
                headers: {
                    ApiKey: `${REACT_APP.API_KEY}`
                }
            })
                .then(res => {
                    if (res.data.length !== 0) {
                        // console.log(res.data)

                        maximumItemWishlist = res.data[0]['nMaximumItemWishlist']

                        if (maximumItemWishlist >= (wishlistitemcnt + 1)) {
                            //let addwishlist = []
                            let newwishlist = []
                            let allarr = []
                            let cnt = 0
                            const newarr = cartitem[index]
                            console.log('new array', newarr)
                            if (newarr.length !== 0) {
                                if (!localStorage.getItem('wishlist')) {
                                    localStorage.setItem('wishlist', JSON.stringify([newarr]))
                                    setwishlist([newarr])
                                    allarr = [newarr]

                                } else {
                                    allarr = [...wishlist, newarr]

                                    setwishlist(allarr), () => {
                                        const genWL_arr = []
                                        const gitem = JSON.parse(localStorage.getItem('wishlist'))
                                        if (gitem.length !== 0) {
                                            for (let i = 0; i < gitem.length; i++) {
                                                genWL_arr.push(gitem[i])
                                            }
                                        }

                                        genWL_arr.push(newarr)

                                        const str_arr = JSON.stringify(genWL_arr)
                                        localStorage.setItem('wishlist', str_arr)

                                    }
                                }
                            }

                            if (allarr.length !== 0) {
                                for (let i = 0; i < allarr.length; i++) {
                                    if (newarr.cid === allarr[i].cid && newarr.pkgId === allarr[i].pkgId) {
                                        cnt++
                                    }
                                }
                            }
                            //
                            // remove duplicate wishlist item
                            if (allarr.length > 1) {
                                newwishlist = allarr.filter((v, i, a) => a.findIndex(t => ((t.cid === v.cid) && (t.pkgId === v.pkgId))) === i)

                                setwishlist((newwishlist))
                                // this.setState({
                                //     wishlistitem: newwishlist
                                // })

                                localStorage.removeItem('wishlist')
                                localStorage.setItem('wishlist', JSON.stringify(newwishlist))
                            } else {
                                newwishlist = allarr
                            }
                            //
                            // check user is login or not
                            if (localStorage.getItem('userData')) {
                                const udata = JSON.parse(localStorage.getItem('userData'))
                                if (newwishlist.length !== 0) {
                                    //check course is already in cart ot not
                                    //const insdata = newwishlist.findIndex(obj => obj.cid === newarr.cid)
                                    console.log(newarr)
                                    if (cnt <= 1) {
                                        Axios.post(`${REACT_APP.API_URL}/api/wishList/InsertWishlist/${udata['regid']}`, newarr, {
                                            headers: {
                                                ApiKey: `${REACT_APP.API_KEY}`
                                            }
                                        }).then(res => {
                                            console.log(res.data)
                                            const retData = JSON.parse(res.data)
                                            if (retData.success === "1") {
                                            } else if (retData.success === "0") {
                                                { ErrorAlert(retData) }
                                            }
                                        })
                                            .catch(err => {
                                                { ErrorDefaultAlert(JSON.stringify(err.response)) }
                                            })
                                    } else {
                                        //delete course from cart
                                        Axios.delete(`${REACT_APP.API_URL}/api/cart/DeleteCart/${EncryptData(newarr.cid)}/${EncryptData(newarr.pkgId)}/${udata['regid']}`, {
                                            headers: {
                                                ApiKey: `${REACT_APP.API_KEY}`
                                            }
                                        })
                                            .then(res => {
                                                const retData = JSON.parse(res.data)
                                                if (retData.success === "1") {
                                                } else { { ErrorAlert(retData) } }
                                            })
                                            .catch(err => {
                                                { ErrorDefaultAlert(err) }
                                            })
                                    }
                                }

                            }
                            setcourseitem(courseitem.filter((item, i) => i !== index)
                            ),() => {
                                localStorage.setItem('cart', JSON.stringify(courseitem))
                            }

                            if(courseitem.length === 1) {
                                localStorage.removeItem('cart')
                                setcourseitem([])
                            }

                        } else {
                            const retData = {
                                title: 'Info',
                                message: `Maximum ${maximumItemWishlist} items added in wishlist.`
                            }
                            toast.error(<ErrorMessageToast pdata={retData} />, { hideProgressBar: true })
                        }
                    }
                })
                .catch(err => {
                    { ErrorDefaultAlert(err) }
                })
    }

  return (
    <tr key={index}>
        <td className="pro-thumbnail">
    <Link href={''}
    >
        <Image src={product.cimg}
               className={"position-relative"}
             width={140}
             height={111}
             alt="Product"
             />
    </Link>
  </td>
        <td className="pro-title">
      {product.cname}
  </td>
        <td className="pro-price">
    <span>₹{product.pay_price}</span>
      {product.sDiscountType === "amount" ? <>
          {product.discount !== 0 ? <>
              <span className={'font-13 text-success m-0'}>
                  ₹ {product.discount} discount applied
              </span>
          </> : <></>}
      </> : <>
          {product.discount !== 0 ? <>
              <span className={'font-13 text-success m-0'}>
                  {product.discount}% discount applied
              </span>
          </> : <></>}
      </>}
      {/*{(item.pkgname) ? <div><span className='text-primary'>Selected Package : </span><span*/}
      {/*    className='text-success font-weight-bolder font-16'>{item.pkgname}</span>*/}
      {/*</div> : ''}*/}
  </td>
        <td className="pro-subtotal">
        <span>₹{checkoutAmount}</span>
      </td>
        <td className="pro-remove">
            <button className={'btn-sm rbt-btn btn-gradient'} onClick={() => handleRemoveItem(product.nCartId, product.cid, product.pkgId)}>
                <i className="feather-x"></i>Remove
            </button>
            <br></br>
            <button className={'mt-3 rbt-btn btn-gradient btn-sm'} onClick={() => handleWishlistCartItem(index, product.cid)}>
                <i className="feather-heart me-2"></i>Move to wishlist
            </button>
        </td>
    </tr>
  );
};

export default CartItems;
