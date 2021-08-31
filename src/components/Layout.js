import React from "react";
import { Switch, Route } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { connect } from "react-redux";
import Header from "./Header";
import routes from "../routes";
import Footer from "./Footer";
// import { Container } from 'react-bootstrap'


class Layout extends React.Component {
    constructor() {
        super();
        this.state = {
            title: "Welcome to Resume Maker!",
        };
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
      this.setState({
        hashElement : window.location.hash
      })
      window.addEventListener('scroll', this.handleScroll);
    }
    createNotification(type, message) {
        console.log(type , message);
        let configs = {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            }
        switch (type) {
          case "info":
            return toast.info(message, configs);
          case "success":
            return toast.success(message, configs);
          case "warning":
            return toast.warn(message, configs);
          case "danger":
            return toast.error(message, configs);
          default:
        }
      }

    componentDidUpdate(){
        let alerts = this.props.alerts || [];
        alerts !== null &&
        alerts.length > 0 &&
        alerts.map((alert, idx) => {
          this.createNotification(`${alert.alertType}`, alert.msg);
          return '';
        });
    }

    handleScroll(e) {
      let elem = document.getElementById("header");
      if(document.getElementById('main').getBoundingClientRect().top < -55){
        elem && elem.classList.add('header-bg')
      } else {
        elem && elem.classList.remove('header-bg')

      }

    }

    render() {

        return (
            <div>
                <ToastContainer 
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss = {false}
                    draggable
                    pauseOnHover
                />
                {/* <h1>{ this.state.title }</h1> */}
                {/* <Container> */}
                <>
                  <Header />
                  <div id="main" className={'inner-page'} onScroll={(e) => this.handleScroll(e)}>
                    <Switch>
                      { routes.map( route => <Route key={ route.path } { ...route } /> ) }
                    </Switch>
                  </div>
                  <Footer />
                </>
                {/* </Container> */}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    alerts: state.alert,
  });
  
export default connect( mapStateToProps )( Layout );
  
