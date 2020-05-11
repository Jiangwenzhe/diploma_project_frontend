/*
 * @Author: Wenzhe
 * @Date: 2020-04-25 16:25:16
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-11 16:22:29
 */
import React, { useEffect, useState } from 'react';
import { connect, Link } from 'umi';
import { useUnmount } from '@umijs/hooks';
import {
  Divider,
  Tabs,
  Row,
  Col,
  Avatar,
  Typography,
  Badge,
  Statistic,
  Form,
  Input,
  Button,
  Modal,
  Upload,
  message,
} from 'antd';
import {
  createFromIconfontCN,
  LoadingOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import icon_font_url from '../../../config/iconfont';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

const IconFont = createFromIconfontCN({
  scriptUrl: icon_font_url,
});

const UserDetail = (props) => {
  const {
    match,
    dispatch,
    userInfo: { userInfo },
    // 当前用户 / 用来开启编辑界面
    user: { currentUser },
  } = props;

  const [resetPassModalVisible, setResetPassModalVisible] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarImageUrl, setAvatarImageUrl] = useState(null);

  const showResetPassModal = () => {
    setResetPassModalVisible(true);
  };

  const hideResetPassModal = () => {
    setResetPassModalVisible(false);
  };

  // 使用 useForm 方法
  const [form, resetPassForm] = Form.useForm();

  useEffect(() => {
    const { uid } = match.params;
    dispatch({
      type: 'userInfo/fetchUserInfo',
      payload: {
        uid,
      },
    });
  }, [match, dispatch]);

  useUnmount(() => {
    dispatch({
      type: 'status/cleanUserInfo',
    });
  });

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('你只能上传 png / jpeg 格式的头像!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小需要小于2MB!');
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
      <div className="ant-upload-text">头像正在上传中...</div>
    </div>
  );

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  const resetpass_layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 17 },
  };

  const resetpass_tailLayout = {
    wrapperCol: { offset: 5, span: 16 },
  };

  useEffect(() => {
    if (currentUser.uid === userInfo.uid) {
      form.setFieldsValue({
        name: userInfo.name,
        motto: userInfo.motto ? userInfo.motto : '',
        mail: userInfo.mail ? userInfo.mail : '',
        school: userInfo.school ? userInfo.school : '',
        company: userInfo.company ? userInfo.company : '',
        avatar: userInfo.avatar ? userInfo.avatar : '',
      });
      setAvatarImageUrl(userInfo.avatar);
    }
  }, [userInfo, form]);

  const onUpdateFormFinish = (values) => {
    console.log('Success:', values);
    const payload = {
      data: { ...values, avatar: avatarImageUrl },
      id: userInfo._id,
      uid: userInfo.uid,
    };
    dispatch({
      type: 'userInfo/updateUserInfo',
      payload,
    });
  };

  const onResetPassFormFinish = (values) => {
    console.log('Success:', values);
    const payload = {
      data: { password: values.password },
      id: userInfo._id,
      uid: userInfo.uid,
    };
    console.log('reset new pass', payload);
    // dispatch({
    //   type: 'userInfo/updateUserInfo',
    //   payload,
    // });
  };

  return (
    <div>
      <Tabs tabPosition="left">
        <TabPane tab="用户信息" key="1">
          <Row style={{ marginTop: '10px' }}>
            <Col span={5} offset={1}>
              <Row justify="space-around" align="middle">
                <Badge
                  count={userInfo.privilege === 3 ? '管理员' : '普通用户'}
                  showZero
                  style={{
                    backgroundColor:
                      userInfo.privilege === 3 ? '#fa541c' : '#1890ff',
                  }}
                >
                  <Avatar shape="square" size={120} src={userInfo.avatar} />
                </Badge>
              </Row>
              <Title style={{ marginTop: '10px' }} level={2}>
                {userInfo.name}
              </Title>
              <Text ellipsis={true}>
                <IconFont type="icon-jilika" />
                <span style={{ marginLeft: '6px' }}>
                  <Text type="secondary">Motto: </Text>
                  {userInfo.motto}
                </span>
              </Text>
              <br />
              <Text ellipsis={true}>
                <IconFont type="icon-email" />
                <span style={{ marginLeft: '6px' }}>
                  <Text type="secondary">Mail: </Text>
                  {userInfo.mail ? userInfo.mail : 'null'}
                </span>
              </Text>
              <br />
              <Text ellipsis={true}>
                <IconFont type="icon-school" />
                <span style={{ marginLeft: '6px' }}>
                  <Text type="secondary">School: </Text>
                  {userInfo.school ? userInfo.school : 'null'}
                </span>
              </Text>
              <br />
              <Text ellipsis={true}>
                <IconFont type="icon-company" />
                <span style={{ marginLeft: '6px' }}>
                  <Text type="secondary">Company: </Text>{' '}
                  {userInfo.company ? userInfo.company : 'null'}
                </span>
              </Text>
              <Divider />
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="已解决"
                    value={
                      userInfo.solved_list ? userInfo.solved_list.length : 0
                    }
                    valueStyle={{ color: '#51C41B' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="尝试过"
                    value={
                      userInfo.submit_list ? userInfo.submit_list.length : 0
                    }
                    valueStyle={{ color: '#FAAD15' }}
                  />
                </Col>
              </Row>
            </Col>
            <Col span={15} offset={2}>
              <div style={{ minHeight: '200px' }}>
                <Title level={4} style={{ fontWeight: 300, display: 'block' }}>
                  已解决:
                </Title>
                {userInfo.solved_list && userInfo.solved_list.length > 0 ? (
                  userInfo.solved_list.map((pid) => (
                    <Link
                      style={{
                        marginRight: '10px',
                        fontSize: '16px',
                        color: '#51C41B',
                      }}
                      to={`/problem/${pid}`}
                      key={pid}
                    >
                      {pid}
                    </Link>
                  ))
                ) : (
                  <div />
                )}
              </div>
              <div style={{ minHeight: '200px' }}>
                <Title level={4} style={{ fontWeight: 300, display: 'block' }}>
                  尝试过:
                </Title>
                {userInfo.failed_list && userInfo.failed_list.length > 0 ? (
                  userInfo.failed_list.map((pid) => (
                    <Link
                      style={{
                        marginRight: '10px',
                        fontSize: '16px',
                        color: '#FAAD15',
                      }}
                      to={`/problem/${pid}`}
                      key={pid}
                    >
                      {pid}
                    </Link>
                  ))
                ) : (
                  <div />
                )}
              </div>
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="用户分析" key="2">
          Content of Tab 3
        </TabPane>
        {currentUser.uid === userInfo.uid && (
          <TabPane tab="编辑" key="3" forceRender>
            <Row>
              <Col span={12}>
                <Form
                  form={form}
                  {...layout}
                  name="basic"
                  // initialValues={{ remember: true }}
                  onFinish={onUpdateFormFinish}
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
                      {avatarImageUrl && !avatarLoading ? (
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
                    <Input />
                  </Form.Item>

                  <Form.Item label="签名" name="motto">
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="邮箱"
                    name="mail"
                    rules={[
                      { type: 'email', message: '请输入正确的电子邮箱格式' },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item label="学校名" name="school">
                    <Input />
                  </Form.Item>

                  <Form.Item label="公司名" name="company">
                    <Input />
                  </Form.Item>

                  <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                      更新
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
              <Col offset={1}>
                <Button onClick={() => showResetPassModal()}>重置密码</Button>
                <Modal
                  title="重置密码"
                  visible={resetPassModalVisible}
                  onCancel={hideResetPassModal}
                  footer={null}
                >
                  <Form
                    form={resetPassForm}
                    {...resetpass_layout}
                    name="resetPass"
                    // initialValues={{ remember: true }}
                    onFinish={onResetPassFormFinish}
                  >
                    <Form.Item
                      label="老密码"
                      name="old_password"
                      rules={[
                        {
                          required: true,
                          message: 'Please input your password!',
                        },
                        ({ getFieldValue }) => ({
                          validator(rule, value) {
                            if (!value || value === userInfo.password) {
                              return Promise.resolve();
                            }
                            return Promise.reject('老密码错误');
                          },
                        }),
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>
                    <Form.Item
                      label="新密码"
                      name="new_password"
                      rules={[
                        {
                          required: true,
                          message: 'Please input your password!',
                        },
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>
                    <Form.Item
                      label="重复密码"
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: 'Please input your password!',
                        },
                        ({ getFieldValue }) => ({
                          validator(rule, value) {
                            if (
                              !value ||
                              getFieldValue('new_password') === value
                            ) {
                              return Promise.resolve();
                            }
                            return Promise.reject('你与之前输入的密码不符！');
                          },
                        }),
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>
                    <Form.Item {...resetpass_tailLayout}>
                      <Button type="primary" htmlType="submit">
                        重置密码
                      </Button>
                    </Form.Item>
                  </Form>
                </Modal>
              </Col>
            </Row>
          </TabPane>
        )}
      </Tabs>
    </div>
  );
};

export default connect(({ userInfo, loading, user }) => ({
  userInfo,
  user,
  fetchUserInfoLoading: loading.effects['userInfo/fetchUserInfo'],
}))(UserDetail);
