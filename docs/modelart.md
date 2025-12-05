Huawei ModelArt
APIkey:jDJlFHvT3ZJVYWDTNqEJFDzIiNxFlmR3daNoeEstaRQj78pn40CatR3BRxZ6SA-pQlf_g3BuN8YmsYVSYUJOwA

文本模型

# DeepSeek-V3.2
该模型在 V3 基础上突破性引入DeepSeek Sparse Attention（DSA）稀疏注意力机制，通过动态识别文本关键节点构建混合注意力网络，实现 “算力精准投放”。实测数据显示，其在 16K 长序列处理中推理速度提升 22%，同时保持 98.7% 的准确率，GPU 内存占用从 48GB 压缩至 32GB，计算资源消耗降低 30%。
架构上延续 MoE（混合专家）设计，但更侧重推理效率优化。配合华为云昇腾集群适配，其单卡可支持 160K 字符上下文窗口，成为长文本处理场景的技术标杆

API地址
https://api.modelarts-maas.com/v2/chat/completions
model参数
deepseek-v3.2-exp
APIkey:jDJlFHvT3ZJVYWDTNqEJFDzIiNxFlmR3daNoeEstaRQj78pn40CatR3BRxZ6SA-pQlf_g3BuN8YmsYVSYUJOwA


Python调用示例
```
import requests
import json
if __name__ == '__main__':
    url = "https://api.modelarts-maas.com/v2/chat/completions"  # API地址
    api_key = "MAAS_API_KEY"  # 把MAAS_API_KEY替换成已获取的API Key

    # Send request.
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {api_key}'
    }
    data = {
        "model": "deepseek-v3.2-exp",  # model参数
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "你好"}
        ],
        "chat_template_kwargs": {
            "thinking": True  # 是否开启深度思考模式，默认关闭
        }
    }
    response = requests.post(url, headers=headers, data=json.dumps(data), verify=False)

    # Print result.
    print(response.status_code)
    print(response.text)
```

# Qwen3-235B-A22B
Qwen3 系列的进阶版本，其核心优势在于混合 MoE 架构与超大规模训练数据的结合。采用 235B 总参数但仅激活 22B 参数的设计，在保证性能的同时降低部署成本，36 万亿 tokens 的预训练数据覆盖 119 种语言，多模态处理能力显著领先。

创新引入 “思考模式 + 非思考模式” 双切换机制：复杂任务启用深度推理，简单对话切换快速响应，在实时数据分析等场景实现 “性能与速度的平衡”。最新发布的 Qwen3-Max 版本更是将参数规模提升至 1T，上下文窗口扩展至 256K，进一步拉大长文本处理的参数优势。

接口信息
API地址
https://api.modelarts-maas.com/v1/chat/completions
model参数
qwen3-235b-a22b

import requests
import json

if __name__ == '__main__':
    url = "https://api.modelarts-maas.com/v1/chat/completions"  # API地址
    api_key = "MAAS_API_KEY"  # 把MAAS_API_KEY替换成已获取的API Key

    # Send request.
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {api_key}'
    }
    data = {
        "model": "qwen3-235b-a22b",  # model参数
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "你好"}
        ]
    }
    response = requests.post(url, headers=headers, data=json.dumps(data), verify=False)

    # Print result.
    print(response.status_code)
    print(response.text)


# 图像理解模型

# Qwen2.5-VL-72B-32K
通义千问2.5-VL-72B是多模态大模型，参数规模达720亿。
该模型具备强大的视觉和语言理解能力，支持图像、文本、视频等多种输入，能够处理复杂场景下的图文理解和推理任务。
此外，它在长视频处理、结构化数据输出和多语言支持等方面表现出色，适用于多种企业级和科研级应用。


接口信息
API地址
https://api.modelarts-maas.com/v1/chat/completions
model参数
qwen2.5-vl-72b

import requests
import json
import base64
#  图片转Base64编码格式
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


base64_image = encode_image("test.png")

if __name__ == '__main__':
    url = "https://api.modelarts-maas.com/v1/chat/completions"  # API地址
    api_key = "MAAS_API_KEY"  # 把MAAS_API_KEY替换成已获取的API Key

    # Send request.
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {api_key}'
    }
    data = {
        "model": "qwen2.5-vl-72b",  # model参数
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "描述下图片里的内容"
                    },
                    {
                        "type": "image_url",
                        # 需要注意，Base64，图像格式（即image/{format}）需要与支持的图片列表中的Content Type保持一致。"f"是字符串格式化的方法。
                        # PNG图像：  f"data:image/png;base64,{base64_image}"
                        # JPEG图像： f"data:image/jpeg;base64,{base64_image}"
                        # WEBP图像： f"data:image/webp;base64,{base64_image}"
                        "image_url": {
                            "url": f"data:image/png;base64,{base64_image}"
                        }
                    }
                ]
            }
        ]
    }
    response = requests.post(url, headers=headers, data=json.dumps(data), verify=False)

    # Print result.
    print(response.status_code)
    print(response.text)