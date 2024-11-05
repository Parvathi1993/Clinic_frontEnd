import React, { useCallback, memo, useState, useMemo, useEffect } from 'react'
import { Box } from '@mui/joy'
import { Paper } from '@mui/material'
import Typography from '@mui/joy/Typography'
import CustomInput from '../../../Components/CustomInput'
import Button from '@mui/material/Button';
import { axioslogin } from '../../../AxiosConfig/Axios'
import { ToastContainer } from 'react-toastify'
import { succesNotify, warningNotify } from '../../../Components/CommonCode'
import CusIconButton from '../../../Components/CusIconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { CssVarsProvider } from '@mui/joy/'
import Table from '@mui/joy/Table';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom'
import SupplierSelect from '../../../Components/SupplierSelect'
import ItemNameSelect from '../../../Components/ItemNameSelect'
import GstSelect from '../../../Components/GstSelect'


const StockInwardEntry = () => {
    const navigate = useNavigate()
    const [supplier, setSupplier] = useState(0)
    const [supplierData, setSupplierData] = useState({
        suppAddress: '',
        suppPh: ''
    })
    const { suppAddress, suppPh } = supplierData

    const [billno, setbillno] = useState('')
    const [billdate, setbilldate] = useState('')
    const [itemArray, setItemArray] = useState([])
    useEffect(() => {
        const getsupplier = async (supplier) => {
            const result = await axioslogin.get(`/Suppliermaster/getSupplierById/${supplier}`)
            const { success, data } = result.data
            if (success === 1) {
                const { supplier_name, supplier_address, supplier_phno } = data[0]
                const setfrmdata = {
                    suppAddress: supplier_address,
                    suppPh: supplier_phno
                }
                setSupplierData(setfrmdata)
            } else {
                const resetfrmdata = {
                    suppAddress: '',
                    suppPh: ''
                }
                setSupplierData(resetfrmdata)
            }
        }
        if (supplier !== 0) {
            getsupplier(supplier)
        }
    }, [supplier])


    useEffect(() => {
        const getItem = async () => {
            const result = await axioslogin.get('/ItemMaster/getActiveItem');
            const { success, data } = result.data
            if (success === 1) {
                setItemArray(data)
            } else {
                setItemArray([])
            }
        }
        getItem()
    }, [])
    const [itemslno, setItemSlno] = useState(0)
    const [itemName, setItemName] = useState('')
    const [gst, setGst] = useState(0)
    const [inwardDetail, setInwardDetail] = useState({
        batch: '',
        expeiry: '',
        quantity: '',
        free_quantity: '',
        mrp: '',
        purchase_rate: ''
    })

    const { batch, expeiry, quantity, free_quantity, mrp, purchase_rate } = inwardDetail

    const updateinwardDetail = useCallback((e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setInwardDetail({ ...inwardDetail, [e.target.name]: value })
    }, [inwardDetail])

    const [stockAddedArray, setStockAddedArray] = useState([])
    const [arrayDisFlag, setarryDisFlag] = useState(0)
    const [discount, setDiscount] = useState('')
    const AddStock = useCallback(() => {
        if (itemslno === 0) {
            warningNotify("Please Select Any Item")
        } else {

            const newData = {
                id: Math.ceil(Math.random() * 1000),
                itemslno: itemslno,
                itemName: itemName,
                batch: batch,
                expeiry: expeiry,
                quantity: quantity,
                free_quantity: free_quantity,
                total_quntity: parseInt(quantity) + parseInt(free_quantity),
                gst: gst,
                mrp: mrp,
                purchase_rate: purchase_rate,

            }
            const datass = [...stockAddedArray, newData]
            if (stockAddedArray.length !== 0) {
                if (stockAddedArray[0].itemslno !== itemslno) {
                    setStockAddedArray(datass)
                    setarryDisFlag(1)
                    setItemSlno(0)
                    const resetfrmdata = {
                        batch: '',
                        expeiry: '',
                        quantity: '',
                        free_quantity: '',
                        mrp: '',
                        purchase_rate: ''
                    }
                    setInwardDetail(resetfrmdata)
                    setGst(0)
                }
                else {
                    warningNotify("Item Already Added")
                }
            } else {
                setStockAddedArray(datass)
                setarryDisFlag(1)
                setItemSlno(0)
                setGst(0)
                const resetfrmdata = {
                    batch: '',
                    expeiry: '',
                    quantity: '',
                    free_quantity: '',
                    mrp: '',
                    purchase_rate: ''
                }
                setInwardDetail(resetfrmdata)
            }
        }
    }, [itemslno, itemName, batch, expeiry, quantity, free_quantity, mrp, purchase_rate, gst])

    console.log(stockAddedArray);

    // let totalPurchaseRate = stockAddedArray.reduce((sum, obj) => sum + obj.purchase_rate, 0);
    let totalPurchaseRate = stockAddedArray.reduce((accumulator, item) => {
        return accumulator + parseFloat(item.purchase_rate);
    }, 0);

    const rowSelect = useCallback((val) => {
        const { id } = val
        const xx = stockAddedArray?.filter((val) => val.id !== id)
        setStockAddedArray(xx)
    }, [stockAddedArray])

    const postMasterData = useMemo(() => {
        return {
            supplier_slno: supplier,
            inward_billno: billno,
            inward_billdate: billdate,
            total_purchase_rate: totalPurchaseRate,
            total_discount: discount
        }
    }, [supplier, billno, billdate, totalPurchaseRate, discount])

    const submit = useCallback(() => {
        const insertInwardMast = async (postMasterData) => {
            const result = await axioslogin.post('/StockInward', postMasterData);
            return result.data
        }

        const InsertInwarddetl = async (insetid) => {
            const postdataDetl = stockAddedArray && stockAddedArray.map((val, index) => {
                return {
                    stock_bill_mast_slno: insetid,
                    item_slno: val.itemslno,
                    batch: val.batch,
                    expeiry: val.expeiry,
                    quantity: val.quantity,
                    free_quantity: val.free_quantity,
                    total_quntity: val.total_quntity,
                    gst: val.gst,
                    mrp: val.mrp,
                    purchase_rate: val.purchase_rate
                }
            })
            const result = await axioslogin.post('/StockInward/InwardDetailsInsert', postdataDetl);
            const { success, message } = result.data
            if (success === 1) {
                succesNotify(message)
            } else {
                warningNotify(message)
            }
        }

        // console.log("postMasterData", postMasterData)
        if (stockAddedArray.length !== 0) {
            insertInwardMast(postMasterData).then((value) => {
                const { success, message, insetid } = value
                if (success === 1) {
                    InsertInwarddetl(insetid)
                } else {
                    warningNotify(message)
                }



            })
        } else {
            warningNotify("Please Enter items")
        }

    }, [postMasterData, stockAddedArray])


    const CloseMAster = useCallback(() => {
        navigate('/Home')
    }, [])

    return (
        <Box sx={{ width: "100%", p: 5 }}>
            <ToastContainer />
            <Paper sx={{
                width: '100%',
                mt: 0.8
            }} variant='outlined'>
                <Box sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column"
                }}>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: "center" }}>
                        <Typography level='body-md' fontWeight='lg' >Stock Inward Entry</Typography>
                    </Box>
                    <Box sx={{ width: '100%', display: 'flex', pt: 2.5, justifyContent: "center", }}>
                        <Box sx={{ pl: 0.8, width: "10%", cursor: "pointer" }}>
                            <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Select Supplier</Typography>
                        </Box>
                        <Box sx={{ pl: 0.8, width: "20%", cursor: "pointer" }}>
                            <SupplierSelect supplier={supplier} setSupplier={setSupplier} />
                        </Box>
                        <Box sx={{ pl: 3, width: "10%", cursor: "pointer" }}>
                            <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Address:</Typography>
                        </Box>
                        <Box sx={{ pl: 2, width: "25%" }}>
                            <CustomInput
                                type="text"
                                size="sm"
                                name="suppAddress"
                                value={suppAddress}
                                disable={true}
                            />
                        </Box>
                        <Box sx={{ pl: 3, width: "5%", cursor: "pointer" }}>
                            <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Ph:</Typography>
                        </Box>
                        <Box sx={{ pl: 2, width: "15%" }}>
                            <CustomInput
                                type="text"
                                size="sm"
                                name="suppPh"
                                value={suppPh}
                                disable={true}
                            />
                        </Box>
                    </Box>

                    <Box sx={{ width: '100%', display: 'flex', pt: 2.5, justifyContent: "center", }}>

                        <Box sx={{ pl: 0.8, width: "15%", cursor: "pointer" }}>
                            <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Bill No</Typography>
                        </Box>
                        <Box sx={{ pl: 0.8, width: "15%", cursor: "pointer" }}>
                            <CustomInput placeholder={"Enter Bill No"}
                                type="text"
                                size="sm"
                                name="billno"
                                value={billno}
                                handleChange={(e) => setbillno(e.target.value)} />
                        </Box>
                        <Box sx={{ pl: 0.8, width: "15%", cursor: "pointer" }}>
                            <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Bill date</Typography>
                        </Box>
                        <Box sx={{ pl: 0.8, width: "15%", cursor: "pointer" }}>
                            <CustomInput placeholder={"Enter Bill date"}
                                type="date"
                                size="sm"
                                name="billdate"
                                value={billdate}
                                handleChange={(e) => setbilldate(e.target.value)} />
                        </Box>
                    </Box>

                    <Box sx={{ width: '100%', display: 'flex', pt: 2.5, flexDirection: "column", justifyContent: "center", }}>
                        <Box sx={{ width: '100%', display: 'flex', flexDirection: "row", }}>
                            <Box sx={{ pl: 2, width: "20%", display: 'flex', justifyContent: "center", cursor: "pointer" }}>
                                <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Item</Typography>
                            </Box>
                            <Box sx={{ pl: 0.8, width: "10%", display: 'flex', justifyContent: "center", cursor: "pointer" }}>
                                <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Batch</Typography>
                            </Box>
                            <Box sx={{ pl: 0.8, width: "10%", display: 'flex', justifyContent: "center", cursor: "pointer" }}>
                                <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Quantity</Typography>
                            </Box>
                            <Box sx={{ pl: 0.8, width: "10%", display: 'flex', justifyContent: "center", cursor: "pointer" }}>
                                <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Expiry</Typography>
                            </Box>
                            <Box sx={{ pl: 0.8, width: "10%", display: 'flex', justifyContent: "center", cursor: "pointer" }}>
                                <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Free Quantity</Typography>
                            </Box>
                            <Box sx={{ pl: 0.8, width: "10%", display: 'flex', justifyContent: "center", cursor: "pointer" }}>
                                <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >GST</Typography>
                            </Box>
                            <Box sx={{ pl: 0.8, width: "10%", display: 'flex', justifyContent: "center", cursor: "pointer" }}>
                                <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >MRP</Typography>
                            </Box>
                            <Box sx={{ pl: 0.8, width: "10%", display: 'flex', justifyContent: "center", cursor: "pointer" }}>
                                <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Purchase Rate</Typography>
                            </Box>
                            <Box sx={{ pl: 0.8, width: "10%", display: 'flex', justifyContent: "center", cursor: "pointer" }}>
                                <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Add Item</Typography>
                            </Box>
                        </Box>

                        <Box sx={{ width: '100%', display: 'flex', flexDirection: "row", }}>
                            <Box sx={{ pl: 2, width: "20%", cursor: "pointer" }}>
                                <ItemNameSelect itemArray={itemArray} itemslno={itemslno} setItemSlno={setItemSlno}
                                    setItemName={setItemName} />
                            </Box>
                            <Box sx={{ pl: 0.8, width: "10%", cursor: "pointer" }}>
                                <CustomInput
                                    type="text"
                                    size="sm"
                                    name="batch"
                                    value={batch}
                                    handleChange={updateinwardDetail} />
                            </Box>
                            <Box sx={{ pl: 0.8, width: "10%", cursor: "pointer" }}>
                                <CustomInput
                                    type="text"
                                    size="sm"
                                    name="quantity"
                                    value={quantity}
                                    handleChange={updateinwardDetail} />

                            </Box>
                            <Box sx={{ pl: 0.8, width: "10%", cursor: "pointer" }}>
                                <CustomInput
                                    type="date"
                                    size="sm"
                                    name="expeiry"
                                    value={expeiry}
                                    handleChange={updateinwardDetail} />
                            </Box>
                            <Box sx={{ pl: 0.8, width: "10%", cursor: "pointer" }}>
                                <CustomInput
                                    type="text"
                                    size="sm"
                                    name="free_quantity"
                                    value={free_quantity}
                                    handleChange={updateinwardDetail} />
                            </Box>
                            <Box sx={{ pl: 0.8, width: "10%", cursor: "pointer" }}>
                                <GstSelect gst={gst} setGst={setGst} />
                            </Box>
                            <Box sx={{ pl: 0.8, width: "10%", cursor: "pointer" }}>
                                <CustomInput
                                    type="text"
                                    size="sm"
                                    name="mrp"
                                    value={mrp}
                                    handleChange={updateinwardDetail} />
                            </Box>
                            <Box sx={{ pl: 0.8, width: "10%", cursor: "pointer" }}>
                                <CustomInput
                                    type="text"
                                    size="sm"
                                    name="purchase_rate"
                                    value={purchase_rate}
                                    handleChange={updateinwardDetail} />
                            </Box>

                            <Box sx={{ pl: 8, width: "10%", cursor: "pointer" }}>
                                <CusIconButton size="sm" variant="outlined" clickable="true" color="primary" onClick={AddStock} >
                                    <AddCircleOutlineIcon fontSize='small' />
                                </CusIconButton>
                            </Box>
                        </Box>

                        {
                            arrayDisFlag === 1 ?
                                <Box sx={{ p: 1 }}>
                                    <Box sx={{ border: 0.2, p: 1 }}>
                                        <CssVarsProvider>
                                            <Table stickyHeader>
                                                <thead>
                                                    <tr>
                                                        <th style={{ width: '10%', align: "center" }}>Sl No</th>
                                                        <th style={{ width: '15%', align: "center" }}>Item Name</th>
                                                        <th style={{ width: '10%', align: "center" }}>Batch</th>
                                                        <th style={{ width: '10%', align: "center" }}>Expeiry</th>
                                                        <th style={{ width: '10%', align: "center" }}>Quantity</th>
                                                        <th style={{ width: '10%', align: "center" }}>Free quantity</th>
                                                        <th style={{ width: '10%', align: "center" }}>GST</th>
                                                        <th style={{ width: '10%', align: "center" }}>MRP</th>
                                                        <th style={{ width: '10%', align: "center" }}>Purchase Rate</th>
                                                        <th style={{ width: '10%', align: "center" }}>Delete</th>

                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {stockAddedArray && stockAddedArray.map((val, index) => {
                                                        return <tr
                                                            key={index}
                                                            sx={{
                                                                '&:last-child td, &:last-child th': { border: 0 }, maxHeight: 60,
                                                                minHeight: 5
                                                            }}
                                                        >
                                                            <td> {index + 1}</td>
                                                            <td> {val.itemName}</td>
                                                            <td> {val.batch}</td>
                                                            <td> {val.expeiry}</td>
                                                            <td> {val.quantity}</td>
                                                            <td> {val.free_quantity}</td>
                                                            <td> {val.gst}</td>
                                                            <td> {val.mrp}</td>
                                                            <td> {val.purchase_rate}</td>
                                                            <td>
                                                                <DeleteIcon size={6} onClick={() => rowSelect(val)} />
                                                            </td>
                                                        </tr>
                                                    })}
                                                </tbody>
                                            </Table>
                                        </CssVarsProvider>
                                    </Box>
                                    <Box>
                                        <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", pt: 1 }}>
                                            <Box sx={{ width: "20%", pt: 0.5, }}>
                                            </Box>
                                            <Box sx={{ width: "20%", pt: 0.5, }}>
                                                <Typography sx={{ fontSize: 15, fontFamily: 'sans-serif', fontWeight: 550, pl: 8 }} >Total Purchase Rate</Typography>
                                            </Box>
                                            <Box sx={{ width: "10%", pt: 0.5, }}>
                                                <CustomInput
                                                    type="text"
                                                    size="sm"
                                                    name="totalPurchaseRate"
                                                    value={totalPurchaseRate}
                                                    disable={true}
                                                />
                                            </Box>
                                            <Box sx={{ width: "20%", pt: 0.5, }}>
                                                <Typography sx={{ fontSize: 15, fontFamily: 'sans-serif', fontWeight: 550, pl: 8 }} >Total Discount</Typography>
                                            </Box>
                                            <Box sx={{ width: "10%", pt: 0.5, }}>
                                                <CustomInput
                                                    type="text"
                                                    size="sm"
                                                    name="discount"
                                                    value={discount}
                                                    handleChange={(e) => setDiscount(e.target.value)} />
                                            </Box>

                                        </Box>
                                    </Box>
                                </Box> :
                                null
                        }



                        <Box sx={{ width: '100%', display: 'flex', pt: 2.5, flexDirection: "row", justifyContent: "center", pb: 1 }}>

                            <Box sx={{ pl: 2 }}>
                                <Button color="primary" variant="contained" onClick={submit} >Save</Button>
                            </Box>
                            <Box sx={{ pl: 2 }}>
                                <Button color="primary" variant="contained" onClick={CloseMAster}>Close</Button>
                            </Box>

                        </Box>

                    </Box>
                </Box>
            </Paper >

        </Box >
    )
}

export default memo(StockInwardEntry)