import React, { useEffect } from "react";
import DragDrop from "../components/DragDrop";
import dbConnect from "../lib/dbConnect";
import file from "../models/File";
import { Breadcrumb, Button, Layout, Menu, theme, Modal } from "antd";
import { AppstoreOutlined, UploadOutlined } from "@ant-design/icons";
import CustomTable from "../components/CustomTable";
import useSWR from "swr";
import Table from "../components/CustomTable";

const { Header, Content, Footer } = Layout;
const Index = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [fileData, setFileData] = React.useState();
  const [tableData, setTableData] = React.useState([]);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const contentType = "application/json";
  const getData = async () => {
    try {
      const res = await fetch("/api/files", {
        method: "GET",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
      });
      const result = await res.json();
      console.log("res :>> ", result.data);
      setTableData(result.data);
      if (!res.ok) {
        throw new Error(res.status);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  const postData = async (form) => {
    try {
      const res = await fetch("/api/files", {
        method: "POST",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify(form),
      });
      console.log("res :>> ", res);
      if (res.ok) {
        getData();
      }
      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleOk = () => {
    setIsModalOpen(false);
    setTableData((prev) => [...prev, fileData]);
    postData(fileData);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const items = [
    {
      label: "Home",
      key: "home",
      icon: <AppstoreOutlined />,
      disabled: true,
    },
  ];
  const handleDelete = async (id) => {
    const ID = id;

    try {
      const res = await fetch(`/api/files/${ID}`, {
        method: "Delete",
      });
      if (res.ok) {
        getData();
      }
    } catch (error) {
      console.log("error :>> ", error);
    }
  };
  const updateData = async (form) => {
    try {
      const res = await fetch(`/api/files/${form._id}`, {
        method: "PUT",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        getData();
      }
      if (!res.ok) {
        throw new Error(res.status);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout className="layout">
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
        }}
      >
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          items={items}
        />
      </Header>
      <Content
        className="site-layout"
        style={{
          padding: "0 50px",
        }}
      >
        <Breadcrumb
          style={{
            margin: "16px 0",
          }}
        >
          <Breadcrumb.Item>Home</Breadcrumb.Item>
        </Breadcrumb>
        <div
          style={{
            padding: 24,
            minHeight: 380,
            background: colorBgContainer,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div>
            <Button icon={<UploadOutlined />} onClick={showModal}>
              Click to Upload
            </Button>
          </div>
          <div className="table-container">
            <CustomTable
              tableData={tableData}
              setTableData={setTableData}
              handleDelete={handleDelete}
              updateData={updateData}
            />
          </div>
        </div>
      </Content>
      <Footer
        style={{
          textAlign: "center",
        }}
      >
        Footer
      </Footer>
      <Modal
        title="Upload Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="modal-content">
          <DragDrop fileData={fileData} setFileData={setFileData} />
        </div>
      </Modal>
    </Layout>
  );
};

export async function getServerSideProps() {
  await dbConnect();

  const result = await file.find({});
  const pets = result.map((doc) => {
    const pet = doc.toObject();
    pet._id = pet._id.toString();
    return pet;
  });

  return { props: { pets: JSON.parse(JSON.stringify(pets)) } };
}

export default Index;
