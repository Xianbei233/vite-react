import { Button, Form, Input, Modal, Row } from "antd";
import React, { Component } from "react";

const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 14 },
    sm: { span: 14 },
  },
};

const FormItem = Form.Item;

export default class ModalEdit extends Component {
  static defaultProps = {
    rowData: {},
  };

  state = {
    visible: false,
  };

  form = undefined;

  hideModal = () => {
    this.form?.resetFields();
    this.setState({
      visible: false,
    });
  };

  handleSubmit = (values) => {};

  render() {
    const { visible } = this.state;
    const { rowData, loading } = this.props;

    const content = {
      width: "75%",
      title: rowData.path ? "修改自定义表单配置" : "新增自定义表单配置",
      footer: null,
      wrapClassName: "vertical-center-modal-drag",
      visible,
      // closable: false,
      // style: { height: 600, overflowY: 'scroll' },
      onCancel: this.hideModal,
      mask: true,
      maskClosable: false,
      centered: true,
    };

    return (
      <Modal {...content} bodyStyle={{ maxHeight: 640, overflowY: "scroll" }}>
        <Form
          onFinish={this.handleSubmit}
          ref={(form) => {
            this.form = form;
          }}
        >
          <FormItem
            {...formItemLayout}
            label="备注描述"
            name="label"
            initialValue={rowData.label}
            rules={[{ required: true, message: "请填写" }]}
          >
            <Input placeholder="请输入" />
          </FormItem>

          <Row type="flex" justify="center" style={{ marginTop: "16px" }}>
            <Button
              onClick={this.hideModal}
              style={{ marginLeft: 0, marginRight: 16 }}
            >
              取消
            </Button>
            <Button
              type="primary"
              className="ok-btn"
              htmlType="submit"
              loading={loading}
            >
              提交
            </Button>
          </Row>
        </Form>
      </Modal>
    );
  }
}
