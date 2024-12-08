import { Input, Button, Modal, Form, message } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import styles from './index.less'

export default function HomePage() {
  const [addModalShow, setAddModalShow] = useState(false)
  const [list, setList] = useState([])
  const [showList, setShowList] = useState([])
  const [form] = Form.useForm();

  useEffect(() => {
    if (window.electronAPI) {
      initData()
    }
  }, [])

  const initData = async () => {
    const res = await window.electronAPI.readDataFile()
    if (typeof res === 'string') {
      const data = JSON.parse(res)
      setList(data?.commandList)
      setShowList(data?.commandList)
    }
  }

  const handleEnter = (event) => {
    if (event.key === 'Enter') {
      setShowList(list.filter((i)=>i.command.includes(event.target.value) || i.description.includes(event.target.value)))
    }
  }

  return (
    <div>
      <div style={{display: 'flex', margin: '30px auto', width: '80%'}}>
        <Input style={{height: 50}} placeholder='请搜索' onKeyDown={handleEnter} />
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
        {showList.map((item) => {
          return (
            <div className={styles.commandItem}>
              <div className={styles.commandItemTitle}>
                <span>{item?.description}</span>
                <span style={{display: 'flex', alignItems: 'center', color: '#e7e7e7'}}>
                  | <span
                      className={styles.copy}
                      onClick={() => {
                        window.electronAPI.copyToClipboard(item?.command)
                        message.success('copy successful')
                      }}
                    >
                      <CopyOutlined style={{marginRight: 2}} />
                      copy
                    </span>
                </span>
              </div>
              <div className={styles.commandCode}>{item?.command}</div>
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
          setList([res, ...list])
          setShowList([res, ...list])
          window.electronAPI.writeDataFile(JSON.stringify({commandList: [res, ...list]}))
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
    </div>
  );
}
