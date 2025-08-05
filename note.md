cơ chế rank user không tối ưu
tìm phương án mới:
-có thể tạo trường chứa tổng tiền mà user đã chi trả
-đến khi vượt mức, thì sẽ kiểm tra và cho người dùng lên rank
-đặt ra mức mà người dùng cần để lên rank 100 1000 100,000

trường Deal cần gì?
-end date
-% discout
-start date
-số lượng
-discout cần rank để sử dụng


xóa deal khi đã hết tg tồn tại của deal

cơ chế role
- khi người dùng đăng kí thì sẽ được cấp role là user
- khi được cấp quyền thì sẽ trở thành seller và được phép đăng bán sản phẩm
- thêm 1 trường dùng để kiểm tra và cho phép người dùng đăng sản phẩm



tối ngày 3/7 đang sửa lỗi sau khi xóa file seller.js


cơ chế tạo xóa sửa sản phẩm phải gắn với id người tạo


xem id người dùng api chỉ có 



acconut ADMIN: quan@example.com

nguoibantest: nguoiban1@example.com

pass:123456123456



ngày 22/4 đang test deal(áp deal vào sản phẩm):đang lỗi






ngày 23/4: 
- Dự án AI tìm kiếm sản phẩm
+tạo thêm 1 trường cho sản phẩm:Tags
+trường này sẽ được ẩn
+nó chỉ xuất hiện khi người dùng tạo sản phẩm
+seller sẽ gắn tags cho nó
+dựa theo đó sẽ luyện thuật toán cho AI sẽ tìm theo những từ tương tự tag đó hoặc đúng tag đó
+người dùng có thể tìm kiếm sản phẩm thông qua các tags đã gán
