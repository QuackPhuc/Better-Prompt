# Better Prompt

[![English](https://img.shields.io/badge/Language-English-blue)](README.md)
[![Tiếng Việt](https://img.shields.io/badge/Language-Tiếng%20Việt-green)](README.vi.md)

Một tiện ích mở rộng trình duyệt giúp bạn tối ưu hóa prompt cho tương tác với AI sử dụng Gemini API. Hoạt động trên Chrome, Edge, Brave, Opera và các trình duyệt khác dựa trên Chromium.

## Tính năng

- Tối ưu prompt với các kiểu khác nhau: cải thiện độ rõ ràng, tăng cường chi tiết, rút gọn hoặc chuyên nghiệp hóa
- Lựa chọn từ các mô hình Gemini khác nhau cho nhu cầu tốc độ và chất lượng khác nhau
- Tối ưu hóa hiệu suất để có thời gian phản hồi nhanh
- Giao diện người dùng đơn giản với các điều khiển dễ sử dụng
- Tích hợp trực tiếp với Gemini API
- Sao chép prompt đã tối ưu vào clipboard chỉ với một cú nhấp chuột

## Cài đặt

### Yêu cầu

- Bất kỳ trình duyệt nào dựa trên Chromium (Chrome, Edge, Brave, Opera, v.v.)
- Khóa API Gemini (lấy tại [Google AI Studio](https://makersuite.google.com/app/apikey))

### Các bước cài đặt

1. Clone repository này hoặc tải xuống tệp ZIP và giải nén
2. Mở trình duyệt của bạn và truy cập trang tiện ích mở rộng
3. Bật "Chế độ nhà phát triển" bằng công tắc (thường ở góc trên bên phải)
4. Nhấp vào "Tải tiện ích đã giải nén" và chọn thư mục tiện ích
5. Biểu tượng Better Prompt sẽ xuất hiện trên thanh công cụ của trình duyệt

## Cách sử dụng

1. Nhấp vào biểu tượng Better Prompt trên thanh công cụ trình duyệt
2. Nhấp vào biểu tượng cài đặt và nhập khóa API Gemini của bạn, sau đó nhấp "Lưu"
3. Nhập hoặc dán prompt bạn muốn tối ưu hóa
4. Chọn kiểu tối ưu hóa:
   - Cải thiện độ rõ ràng: Làm cho prompt rõ ràng và có cấu trúc hơn
   - Tăng cường chi tiết: Phân tích ý định người dùng, thêm hướng dẫn hệ thống chi tiết, bổ sung thông tin ngữ cảnh quan trọng và tăng cường prompt với các chi tiết theo chủ đề
   - Rút gọn: Làm ngắn gọn prompt nhưng vẫn giữ được ý định
   - Chuyên nghiệp hóa: Viết lại prompt để phù hợp với ngữ cảnh chuyên nghiệp
5. Chọn mô hình dựa trên nhu cầu của bạn:
   - Flash (Cân bằng): Cân bằng tốt giữa tốc độ và chất lượng
   - Flash Lite (Nhanh nhất): Tối ưu cho tốc độ, tốt nhất cho prompt ngắn
   - Pro (Chất lượng cao): Kết quả chất lượng cao hơn nhưng chậm hơn
   - Flash Thinking (Chi tiết): Phân tích chi tiết hơn, phù hợp cho prompt phức tạp
   - Flash Exp (Thử nghiệm): Các tính năng thử nghiệm mới nhất
6. Nhấp "Tối ưu hóa" và đợi kết quả
7. Sử dụng biểu tượng sao chép ở góc trên bên phải của hộp kết quả để sao chép prompt đã tối ưu hóa vào clipboard

## Tối ưu hóa hiệu suất

Tiện ích này được tối ưu hóa hiệu suất với:
- Bộ nhớ đệm phản hồi để tránh các cuộc gọi API trùng lặp
- Hoạt động DOM hiệu quả
- Tăng tốc phần cứng cho hoạt ảnh mượt mà
- Thời gian chờ yêu cầu để tránh treo
- Xử lý sự kiện được debounce

## Lưu ý về Bảo mật

- Tiện ích mở rộng này lưu trữ khóa API của bạn cục bộ trong trình duyệt với sự che giấu cơ bản
- Đây không phải là mã hóa an toàn - khóa API vẫn dễ bị tấn công bởi người có ý định xấu
- Không sử dụng tiện ích mở rộng này trên máy tính được chia sẻ hoặc công cộng
- Xóa dữ liệu trình duyệt nếu bạn cần xóa khóa API đã lưu
- Không bao giờ chia sẻ khóa API của bạn với người khác

## Phát triển

### Cấu trúc dự án

- `manifest.json`: Cấu hình tiện ích mở rộng
- `popup.html`, `popup.css`, `popup.js`: Các thành phần giao diện người dùng
- `background.js`: Xử lý giao tiếp API và bộ nhớ đệm
- `content.js`: Chứa chức năng tích hợp với trang web
- `images/`: Các tệp biểu tượng cho tiện ích mở rộng

### Xây dựng và kiểm tra

1. Thực hiện các thay đổi cần thiết đối với mã
2. Tải tiện ích mở rộng vào trình duyệt của bạn như được mô tả trong phần Cài đặt
3. Nhấp vào biểu tượng tiện ích mở rộng để kiểm tra các thay đổi của bạn

## Giấy phép

Dự án này được cấp phép theo Giấy phép MIT.
