import { Input, Button, Modal, Form } from 'antd'
import { useState } from 'react'
import styles from './index.less'

// const Categlory = [
//   { title: 'git' },
//   { title: 'linux' },
// ]

export default function HomePage() {
  const [addModalShow, setAddModalShow] = useState(false)
  const [list, setList] = useState([])
  const [form] = Form.useForm();

  return (
    <div>
      <div style={{display: 'flex', margin: '30px auto', width: '80%'}}>
        <Input style={{height: 50}} placeholder='请搜索' />
        <Button
          onClick={() => {
            form.resetFields()
            setAddModalShow(true)
          }}
          style={{height: 50, marginLeft: 8}}
        >
          Add Command
        </Button>
      </div>
      <div className={styles.commandList}>
        {list.map((item) => {
          return (
            <div className={styles.commandItem}>
              <span>{item.command}</span>
              <span>{item.description}</span>
            </div>
          )
        })}
      </div>
      <Modal
        visible={addModalShow}
        title='Add Command'
        onCancel={() => setAddModalShow(false)}
        destroyOnClose
        onOk={async () => {
          await form.validateFields()
          const res = form.getFieldsValue()
          setList([...list, res])
          setAddModalShow(false)
        }}
      >
        <Form form={form}>
          <Form.Item
            label='Command'
            name='command'
            rules={[
              { required: true }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Description'
            name='description'
            rules={[
              { required: true }
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      {/* <div className={styles.categlory}>
        {Categlory.map((i) => {
          return (
            <div className={styles.categloryItem}>{i.title}</div>
          )
        })}
      </div> */}
    </div>
  );
}
