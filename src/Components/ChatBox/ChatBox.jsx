import React, { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import "./chatbox.css";
import { Col, Row } from "react-bootstrap";
import PersonIcon from "@mui/icons-material/Person";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useEffect } from "react";
import MultipleValueTextInput from "react-multivalue-text-input";
import Loaders from "../Loaders";
import Multiselect from "multiselect-react-dropdown";
import { useSelector } from "react-redux";

const ChatBox = () => {
  const scrollRef = useRef();
  const ageRef = useRef();
  const weightRef = useRef();
  const heightRef = useRef();
  const inchRef = useRef();
  const symtomRef = useRef();
  const allergiesRef = useRef();
  const medicineRef = useRef();

  const [value, setValue] = useState("");
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [msgLoader, setMsgLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [store, setStore] = useState([]);
  const [gptData, setGptData] = useState([]);

  const [drop, setDrop] = useState([
    { name: "12 Hour Allergy and congestion", id: 1 },
    { name: "12 Hour Allergy d", id: 2 },
    { name: "12 Hour Mucus Relief", id: 3 },
    { name: "12 Hour Nasal Decongestant", id: 4 },
    { name: "12 Hour Mucus Relief Nasal", id: 5 },
    { name: "Hour Allergy", id: 6 },
    { name: "8Hr Arthritis Pain", id: 6 },
    { name: "8Hr Arthritis Relief", id: 7 },
    { name: "Equate 8Hr Arthritis Pain Relief", id: 8 },
  ]);

  const { user } = useSelector((state) => state.auth);

  const onChangeHandler = (e) => {
    setValue(e.target.value);
    //console.log(e.target.value);
  };
  console.log(gptData);
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // const sendData = {
    //   message: value,
    // };

    const sendData = {
      message: value,
      messages: gptData,
    };
    setIsLoading(true);
    setStore((store) => [...store, { user: value }, { gpt: "" }]);
    setValue("");
    try {
      const { data } = await axios.post(
        process.env.REACT_APP_SERVER_URL + "/gpt",
        sendData,
        {
          headers: {
            Authorization: "Bearer " + user.token,
          },
        }
      );

      const dbData = {
        gpt: data.result.choices[0].message.content,
        user: value,
        userId: user.id,
      };

      //for db request
      await axios.post(process.env.REACT_APP_SERVER_URL + "/message", dbData);

      setIsLoading(false);
      setMessage(data.result.choices[0].message.content);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (message) {
      setStore((store) => [...store, { user: "" }, { gpt: message }]);
    }

    //test
    const fetchData = async () => {
      const sendData = {
        userId: user.id,
      };

      try {
        const { data } = await axios.post(
          process.env.REACT_APP_SERVER_URL + "/gpts",
          sendData
        );

        const renderData = data.result.map((item) =>
          item.userId == user.id
            ? {
                role: "user",
                content: item.user,
              }
            : []
        );

        setGptData(renderData);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
    //tst
  }, [message]);

  useEffect(() => {
    const fetchData = async () => {
      const sendData = {
        userId: user.id,
      };

      setMsgLoader(true);

      try {
        const { data } = await axios.post(
          process.env.REACT_APP_SERVER_URL + "/gpts",
          sendData
        );
        //extra for api

        //extra for api

        setStore(data.result);
        setMsgLoader(false);
      } catch (err) {
        console.log(err);
      }
    };

    const userId = localStorage.getItem("userId")
      ? JSON.parse(localStorage.getItem("userId"))
      : null;

    if (!userId) {
      localStorage.setItem("userId", JSON.stringify(uuidv4()));
    } else {
      setUserId(userId);
      fetchData();
    }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [store, isLoading]);

  return (
    <>
      {msgLoader ? (
        <Loaders />
      ) : (
        <div className="c-containers">
          <Row className="chat">
            <Col xs={12} sm={12} md={6} lg={7}>
              <div className="chat-left">
                {/* chat */}
                <div className="text mt-2">
                  <>
                    <div className="sender">
                      <div className="ellepse">
                        {" "}
                        <img
                          className="msg-logo"
                          src="/assests/b.png"
                          alt=""
                        />{" "}
                      </div>
                      <div className="message">
                        <p>Hello there! I'm Dr. Mega.</p>
                        <div className="shape"></div>
                      </div>
                    </div>
                    <div className="sender">
                      <div className="ellepse">
                        {" "}
                        <img
                          className="msg-logo"
                          src="/assests/b.png"
                          alt=""
                        />{" "}
                      </div>
                      <div className="message">
                        <p>How can I help?</p>
                        <div className="shape"></div>
                      </div>
                    </div>
                  </>
                  {store.map((item, index) => (
                    <div ref={scrollRef} key={index}>
                      {item.user && (
                        <div className="sender own">
                          <div className="ellepse">
                            <PersonIcon />
                          </div>
                          <div className="message">
                            <p>{item.user}</p>
                            <div className="shapes"></div>
                          </div>
                        </div>
                      )}
                      {item.gpt && (
                        <>
                          <div className="sender">
                            <div className="ellepse">
                              {" "}
                              <img
                                className="msg-logo"
                                src="/assests/b.png"
                                alt=""
                              />{" "}
                            </div>
                            <div className="message">
                              <p>{item.gpt}</p>
                              <div className="shape"></div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div ref={scrollRef} className="sender">
                      <div className="ellepse">
                        {" "}
                        <img
                          className="msg-logo"
                          src="/assests/b.png"
                          alt=""
                        />{" "}
                      </div>
                      <div className="message">
                        <p className="loading"></p>
                        <div className="shape"></div>
                      </div>
                    </div>
                  )}

                  {/* chat end */}
                </div>
                <form onSubmit={onSubmitHandler} className="input-text">
                  <Form.Control
                    value={value}
                    onChange={onChangeHandler}
                    className="b-input"
                    type="text"
                    placeholder="Send a message"
                  />
                  <button type="submit">
                    <span> Send</span>
                    <span>
                      <img
                        style={{ width: "15px", marginBottom: "2px" }}
                        className="btn-image"
                        src="/assests/send.png"
                        alt=""
                      />
                    </span>
                  </button>
                </form>
              </div>
            </Col>
            <Col xs={12} sm={12} md={6} lg={5} className="chat-right">
              <Row className="mt-3">
                <Col md={12} className="top">
                  <h3>
                    <MedicalServicesIcon
                      style={{ color: "#1976D2", fontSize: "28px" }}
                    />{" "}
                    Medical Information
                  </h3>
                  <p>
                    Provide your medical information for more personalized and
                    informative suggestions.
                  </p>
                  <div className="btns2">
                    <button disabled> IMPERIAL</button>
                    <button>METRICS(SI)</button>
                  </div>
                </Col>
              </Row>

              <div className="core">
                <h3>
                  <span>
                    <img
                      style={{ width: "20px" }}
                      src="/assests/circle.png"
                      alt=""
                    />
                  </span>
                  <span> Core</span>
                </h3>
                <div className="mt-4 top-input">
                  <div className="input-items">
                    <div className="form-group">
                      <label>Age</label>
                      <input
                        ref={ageRef}
                        data-toggle="tooltip"
                        data-placement="left"
                        title="Your age"
                        type="number"
                        min={0}
                        className="form-control"
                      />
                      <span className="year">yr</span>
                    </div>

                    <div className="form-group">
                      <label>Weight</label>
                      <input
                        ref={weightRef}
                        data-toggle="tooltip"
                        data-placement="left"
                        title="Weight"
                        min={0}
                        type="number"
                        className="form-control"
                      />
                      <span className="year">Ib</span>
                    </div>
                  </div>

                  {/* second */}
                  <div className="input-items">
                    <div className="d-flex gap-2">
                      <div className="form-groups">
                        <label>Height</label>
                        <input
                          ref={heightRef}
                          type="number"
                          min={0}
                          className="form-control "
                        />
                        <span className="years">ft</span>
                      </div>
                      <div className="form-groups">
                        <label></label>
                        <input
                          ref={inchRef}
                          min={0}
                          type="number"
                          className="form-control"
                        />
                        <span className="years">in</span>
                      </div>
                    </div>
                    <div className="form-groupss">
                      <div>
                        <FloatingLabel
                          style={{ color: "gray" }}
                          controlId="floatingInput"
                        >
                          <MultipleValueTextInput
                            onItemAdded={(item, allItems) => console.log(item)}
                            onItemDeleted={(item, allItems) =>
                              console.log(item)
                            }
                            name="item-input"
                            className="random"
                            placeholder="Symtoms"
                          />
                        </FloatingLabel>
                      </div>
                    </div>
                    {/* <div className="form-groupss">
                  <label>Diastolic Blood Pressure</label>

                  <MultipleValueTextInput
                    onItemAdded={(item, allItems) => console.log(item)}
                    onItemDeleted={(item, allItems) => console.log(item)}
                    name="item-input"
                    className="random"
                    placeholder="name@example.com"
                  />
                  <span className="year">mmHg</span>
                </div> */}
                  </div>
                  {/* second */}

                  <div className="input-items">
                    {/* <div className="form-groupss">
                  <div className="text2">
                    <FloatingLabel
                      style={{ color: "gray" }}
                      controlId="floatingInput"
                      label="Allergies"
                      className="mb-3"
                    >
                      <Form.Control
                        ref={allergiesRef}
                        data-toggle="tooltip"
                        data-placement="left"
                        title="alargies you have"
                        className="ctn"
                        type="email"
                        placeholder="name@example.com"
                      />
                    </FloatingLabel>
                  </div>
                </div> */}

                    <div className="form-groupss">
                      <div>
                        <FloatingLabel
                          style={{ color: "gray" }}
                          controlId="floatingInput"
                        >
                          <MultipleValueTextInput
                            onItemAdded={(item, allItems) => console.log(item)}
                            onItemDeleted={(item, allItems) =>
                              console.log(item)
                            }
                            name="item-input"
                            className="random ps-2"
                            placeholder="Allergies"
                          />
                        </FloatingLabel>
                      </div>
                    </div>

                    {/* <div className="form-groupss">
                  <label>Diastolic Blood Pressure</label>

                  <MultipleValueTextInput
                    onItemAdded={(item, allItems) => console.log(item)}
                    onItemDeleted={(item, allItems) => console.log(item)}
                    name="item-input"
                    className="random"
                  />
                  <span className="year">mmHg</span>
                </div> */}
                    {/* <div className="form-groupss">
                  <div className="text2">
                    <FloatingLabel
                      style={{ color: "gray" }}
                      controlId="floatingInput"
                      label="Medications"
                      className="mb-3"
                    >
                      <Form.Control
                        ref={medicineRef}
                        data-toggle="tooltip"
                        data-placement="left"
                        title="a list f medications that you have"
                        className="ctn"
                        type="email"
                        placeholder="name@example.com"
                      />
                    </FloatingLabel>
                  </div>
                </div> */}
                    <div className="form-groupss">
                      <div>
                        <FloatingLabel
                          style={{ color: "gray" }}
                          controlId="floatingInput"
                        >
                          <Multiselect
                            options={drop} // Options to display in the dropdown
                            // selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                            // onSelect={this.onSelect} // Function will trigger on select event
                            // onRemove={this.onRemove} // Function will trigger on remove event
                            displayValue="name" // Property name to display in the dropdown options
                            className="tt"
                          />
                        </FloatingLabel>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* vital start */}
              <div className="mt-3">
                <div className="vitals">
                  <h3 className="d-flex align-items-center gap-3">
                    <span>
                      <img
                        style={{ width: "26px" }}
                        src="/assests/vital.png"
                        alt=""
                      />
                    </span>{" "}
                    <span className="v-text">Vitals</span>{" "}
                  </h3>

                  <div className="top-input">
                    <div className="input-items mt-3">
                      <div className="form-group">
                        <label>Temperature</label>
                        <input
                          data-toggle="tooltip"
                          data-placement="left"
                          title="Temperature in Fahrenheit. Normal body temperature is 98.6°F (37°C)."
                          type="number"
                          min={0}
                          className="form-control "
                        />
                        <span className="year">°F</span>
                      </div>

                      <div className="form-group3">
                        <label>Heart Rate</label>
                        <input
                          data-toggle="tooltip"
                          data-placement="left"
                          title="Heart Rate is the number of times your heart beats
                       per minute. A normal resting heart rate for adults is 
                       between 60 and 100 beats per minute."
                          min={0}
                          type="number"
                          className="form-control"
                        />
                        <span className="year">BPM</span>
                      </div>
                    </div>

                    <div className="input-items">
                      <div className="form-groupres">
                        <label>Response Rate</label>
                        <input
                          data-toggle="tooltip"
                          data-placement="left"
                          title="Respiratory Rate is the number of breaths you take per
                       minute. A normal respiratory rate for adults is between 12
                       and 16 to 20 breaths per minute."
                          type="number"
                          min={0}
                          className="form-control "
                        />
                        <span className="year">breaths per minutes</span>
                      </div>

                      <div
                        className="form-group
                "
                      >
                        <label>Oxygen Saturation</label>
                        <input
                          data-toggle="tooltip"
                          data-placement="left"
                          title="Oxygen Saturation: fraction of oxygen-saturated hemoglobin
                       relative to total hemoglobin in the blood. Normal oxygen 
                       saturation is 95% to 100%."
                          min={0}
                          type="number"
                          className="form-control"
                        />
                      </div>
                    </div>

                    <div className="input-items">
                      <div className="form-group">
                        <label>Waist Circumference</label>
                        <input
                          data-toggle="tooltip"
                          data-placement="left"
                          title="Waist Circumference is the measurement around the 
                      narrowest part of the waist. It is used to determine if
                       a person has a healthy weight."
                          type="number"
                          min={0}
                          className="form-control "
                        />
                        <span className="year">in</span>
                      </div>

                      <div className="form-group">
                        <label>Hip Circumference</label>
                        <input
                          data-toggle="tooltip"
                          data-placement="left"
                          title="Hip Circumference is the measurement around the widest
                       part of the hips. It is used to determine if a person has a healthy weight"
                          min={0}
                          type="number"
                          className="form-control"
                        />
                        <span className="year">in</span>
                      </div>
                    </div>

                    <div className="input-items">
                      <div className="form-groupresb">
                        <label>Systolic Blood Pressure</label>
                        <input
                          data-toggle="tooltip"
                          data-placement="left"
                          title="Systolic Blood Pressure is the top number in a blood pressure
                       reading. It measures the pressure in your arteries when your heart beats.
                        Normal systolic blood pressure is less than 120 mm Hg."
                          type="number"
                          min={0}
                          className="form-control "
                        />
                        <span className="year">mmHg</span>
                      </div>

                      <div className="form-groupresb">
                        <label>Diastolic Blood Pressure</label>
                        <input
                          data-toggle="tooltip"
                          data-placement="left"
                          title="Diastolic Blood Pressure is the bottom number in a blood
                       pressure reading. It measures the pressure in your arteries when
                        your heart rests between beats. Normal diastolic blood pressure is less than 80 mm Hg."
                          min={0}
                          type="number"
                          className="form-control"
                        />

                        <span className="year">mmHg</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* vital end */}

              {/* lav start */}

              <div className="mt-5">
                <div className="vitals">
                  <h3 className="d-flex align-items-center gap-2">
                    <span>
                      <img
                        style={{ width: "26px" }}
                        src="/assests/d.png"
                        alt=""
                      />
                    </span>{" "}
                    <span className="v-text">Lab Test Results</span>{" "}
                  </h3>

                  <div className="top-input mt-3 mb-5">
                    <div className="input-items mt-3">
                      <div className="form-group3">
                        <label>Albumin</label>
                        <input
                          data-toggle="tooltip"
                          data-placement="left"
                          title="Albumin is a protein made by the liver. It helps keep fluid in
                       the blood vessels. Low albumin levels may be a sign of liver disease,
                        malnutrition, or other conditions. The normal range is 3.4 to 5.4 g/dL."
                          type="number"
                          min={0}
                          className="form-control "
                        />
                        <span className="year">g/dL</span>
                      </div>

                      <div className="form-group3">
                        <label>ALT</label>
                        <input
                          data-toggle="tooltip"
                          data-placement="left"
                          title="An alanine transaminase (ALT) blood test measures the
                       amount of ALT in your blood. ALT levels in your blood can 
                       increase when your liver is damaged. The normal range is 7 
                       to 56 U/L."
                          min={0}
                          type="number"
                          className="form-control"
                        />
                        <span className="year">U/L</span>
                      </div>
                    </div>

                    <div className="input-items">
                      <div className="form-group3">
                        <label>AST</label>
                        <input
                          data-toggle="tooltip"
                          data-placement="left"
                          title="An aspartate transaminase (AST) blood test measures the 
                      amount of AST in your blood. AST levels in your blood can increase
                       when your liver is damaged. The normal range is 13 to 39 U/L."
                          type="number"
                          min={0}
                          className="form-control "
                        />
                        <span className="year">U/L</span>
                      </div>

                      <div className="form-group4">
                        <label>BUN</label>
                        <input
                          data-toggle="tooltip"
                          data-placement="left"
                          title="A blood urea nitrogen (BUN) test reveals important
                       information about how well your kidneys are working. A normal
                        range is 7 to 20 mg/dL or 25 mg/dL."
                          min={0}
                          type="number"
                          className="form-control"
                        />
                        <span className="year">mg/dL</span>
                      </div>
                    </div>

                    <div className="input-items">
                      <div className="form-group">
                        <label>Calcium</label>
                        <input
                          data-toggle="tooltip"
                          data-placement="left"
                          title="Calcium is a mineral that is important for building strong
                       bones and teeth. A normal range is 8.5 to 10.5 mg/dL."
                          type="number"
                          min={0}
                          className="form-control "
                        />
                        <span className="year"></span>
                      </div>

                      <div className="form-group4">
                        <label>creatinine</label>
                        <input
                          data-toggle="tooltip"
                          data-placement="left"
                          title="A creatinine test is a measure of how well your kidneys are
                       performing their job of filtering waste from your blood. A normal
                        range is 0.7 to 1.3 mg/dL."
                          min={0}
                          type="number"
                          className="form-control"
                        />
                        <span className="year">mg/dL</span>
                      </div>
                    </div>

                    <div className="input-items">
                      <div className="form-group4">
                        <label>Glucose</label>
                        <input
                          data-toggle="tooltip"
                          data-placement="left"
                          title="The serum glucose test measures the amount of glucose in
                       your blood. Glucose is a type of sugar that your body uses for
                        energy. A normal range is 70 to 105 mg/dL. A fasting blood 
                        sugar level of 100 mg/dL or higher is considered a sign of diabetes."
                          type="number"
                          min={0}
                          className="form-control "
                        />
                        <span className="year">mg/dL</span>
                      </div>

                      <div className="form-group5">
                        <label>HbA1c</label>
                        <input
                          data-toggle="tooltip"
                          data-placement="left"
                          title="Hemoglobin A1C is a blood test that shows your average
                       blood sugar level for the past 2 to 3 months. A normal range
                        is 4.0 to 5.6 percent."
                          min={0}
                          type="number"
                          name="form-control"
                        />
                        <span className="year">mmol/mol</span>
                      </div>
                    </div>

                    <div className="input-items">
                      <div className="form-group4">
                        <label>Potassium</label>
                        <input
                          data-toggle="tooltip"
                          data-placement="left"
                          title="Potassium is an electrolyte that helps your muscles work
                       properly. A normal range is 3.5 to 5.0 mEq/L."
                          type="number"
                          min={0}
                          className="form-control "
                        />
                        <span className="year">mEq/L</span>
                      </div>

                      <div className="form-group4">
                        <label>Sodium</label>
                        <input
                          data-toggle="tooltip"
                          data-placement="left"
                          title="Sodium is an electrolyte that helps your muscles work 
                      properly. A normal range is 135 to 145 mEq/L."
                          min={0}
                          type="number"
                          className="form-control"
                        />
                        <span className="year">mEq/L</span>
                      </div>
                    </div>

                    <div className="input-items">
                      <div className="form-group4">
                        <label>Triglycerides</label>
                        <input
                          data-toggle="tooltip"
                          data-placement="left"
                          title="Triglycerides are a type of fat found in your blood.
                       A normal range is 40 to 160 mg/dL."
                          type="number"
                          min={0}
                          className="form-control "
                        />
                        <span className="year">mg/dL</span>
                      </div>

                      <div className="form-group4">
                        <label>LDL</label>
                        <input
                          data-toggle="tooltip"
                          data-placement="left"
                          title="Low-density lipoprotein (LDL) is sometimes called 'bad'
                       cholesterol. A normal range is less than 100 mg/dL."
                          min={0}
                          type="number"
                          className="form-control"
                        />
                        <span className="year">mg/dl</span>
                      </div>
                    </div>

                    <div className="input-items">
                      <div className="form-group4">
                        <label>HDL</label>
                        <input
                          data-toggle="tooltip"
                          data-placement="left"
                          title="High-density lipoprotein (HDL) is sometimes called 'good'
                       cholesterol. A normal range is 40 to 60 mg/dL."
                          type="number"
                          min={0}
                          className="form-control "
                        />
                        <span className="year">mg/dL</span>
                      </div>

                      <div className="form-group6">
                        <label>eGFR</label>
                        <input
                          data-toggle="tooltip"
                          data-placement="left"
                          title="Estimated Glomerular Filtration Rate (eGFR) is a measure of 
                      how well your kidneys are working. A normal
                       range is 90 to 120 mL/min/1.73m2."
                          min={0}
                          type="number"
                          className="form-control"
                        />
                        <span className="year">mL/min/1.73m2</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* lab end */}
              <div className="result"></div>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};

export default ChatBox;
