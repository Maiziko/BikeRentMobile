import React from 'react';
import { Link } from 'expo-router';
import Topbar from "../../component/topbar";
import Navbar from "../../component/navbar";
import Map from "../../component/Map";

const Home = () => {
    return (
        <>
            <Map/>
            <Navbar/>
            <Topbar/>
        </>
    )
}

export default Home;