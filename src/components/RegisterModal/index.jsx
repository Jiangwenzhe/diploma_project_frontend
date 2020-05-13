import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Modal, Form, Input, message, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 2, span: 22 },
};

const LoginModal = (props) => {
  const {
    visible,
    hideVisible,
    dispatch,
    submitting,
    // login: { status },
  } = props;

  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarImageUrl, setAvatarImageUrl] = useState(null);

  const onFinish = (values) => {
    console.log(values);
    dispatch({ type: 'login/register', payload: values }).then((result) => {
      console.log(result);
      if (result.status === 'success') {
        hideVisible();
        dispatch({
          type: 'login/login',
          payload: { ...result.loginPayload },
        }).then((status) => {
          if (status === 'ok') {
            message.success(`👏 ${values.name}, 欢迎回来 👏`);
          }
        });
      }
    });
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const handleAvatarChange = (info) => {
    if (info.file.status === 'uploading') {
      setAvatarLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, (imagrUrl) => {
        setAvatarImageUrl(imagrUrl);
        setAvatarLoading(false);
      });
    }
  };

  const uploadButton = (
    <div>
      {avatarLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">请上传头像，若无，则为系统默认头像</div>
    </div>
  );

  // const onFinishFailed = errorInfo => {
  //   console.log('Failed:', errorInfo);
  // };

  return (
    <Modal
      title="(^ ^)用户注册"
      visible={visible}
      // onOk={handleOk}
      onCancel={hideVisible}
      footer={null}
      centered
    >
      <Form
        {...layout}
        name="basic"
        initialValues={{
          privilege: 1,
          motto: '',
          school: '',
          mail: '',
          company: '',
        }}
        onFinish={onFinish}
      >
        <Form.Item label="头像">
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            beforeUpload={beforeUpload}
            onChange={handleAvatarChange}
          >
            {avatarImageUrl ? (
              <img
                src={avatarImageUrl}
                alt="avatar"
                style={{ width: '100%' }}
              />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>
        <Form.Item
          label="用户名"
          name="name"
          rules={[
            {
              required: true,
              message: '请输入你的用户名',
            },
          ]}
        >
          <Input placeholder="请输入用户名" />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[
            {
              required: true,
              message: '请输入密码',
            },
          ]}
        >
          <Input.Password placeholder="请输入密码" />
        </Form.Item>

        <Form.Item label="签名" name="motto">
          <Input placeholder="请输入签名" />
        </Form.Item>

        <Form.Item
          label="邮箱"
          name="mail"
          rules={[{ type: 'email', message: '请输入正确的电子邮箱格式' }]}
        >
          <Input placeholder="请输入邮箱" />
        </Form.Item>

        <Form.Item label="学校" name="school">
          <Input placeholder="请输入学校" />
        </Form.Item>

        <Form.Item label="公司名" name="company">
          <Input placeholder="请输入公司" />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" loading={submitting} block>
            登录
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/register'],
}))(LoginModal);
